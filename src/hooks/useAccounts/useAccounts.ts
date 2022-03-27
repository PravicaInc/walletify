import { useAtomValue } from 'jotai/utils';
import {
  createWalletGaiaConfig,
  generateNewAccount,
  updateWalletConfig,
} from '@stacks/wallet-sdk/dist';
import {
  AnchorMode,
  BadNonceRejection,
  broadcastTransaction,
  bufferCVFromString,
  ClarityValue,
  createAddress,
  createAssetInfo,
  createStacksPrivateKey,
  estimateTransaction,
  FungibleConditionCode,
  makeStandardFungiblePostCondition,
  makeSTXTokenTransfer,
  makeUnsignedContractCall,
  noneCV,
  PostConditionMode,
  pubKeyfromPrivKey,
  publicKeyToString,
  SignedTokenTransferOptions,
  someCV,
  StacksTransaction,
  standardPrincipalCVFromAddress,
  TransactionSigner,
  TxBroadcastResult,
  uintCV,
  UnsignedContractCallOptions,
} from '@stacks/transactions/dist';
import {
  accountAvailableStxBalanceState,
  accounts,
  selectedAccount,
  selectedAccountIndex,
} from './accountsStore';
import { useAtom } from 'jotai';
import { wallet } from '../useWallet/walletStore';
import { gaiaUrl } from '../../shared/constants';
import { selectedNetwork } from '../useNetwork/networkStore';
import {
  createContractCallPayload,
  createTokenTransferPayload,
} from '@stacks/transactions/dist/payload';
import { EstimationsLevels, FeeEstimation } from '../../shared/types';
import BigNumber from 'bignumber.js';
import { ftUnshiftDecimals, stxToMicroStx } from '../../shared/balanceUtils';
import { AccountToken } from '../../models/account';
import BN from 'bn.js';

const MAX_NONCE_INCREMENT_RETRIES = 5;

export const useAccounts = () => {
  const network = useAtomValue(selectedNetwork);
  const walletAccounts = useAtomValue(accounts);
  const [currentWallet, setCurrentWallet] = useAtom(wallet);
  const [selectedAccountIndexState, setSelectedAccountIndexState] =
    useAtom(selectedAccountIndex);
  const selectedAccountState = useAtomValue(selectedAccount);

  const createAccount = async () => {
    if (currentWallet) {
      const newWallet = generateNewAccount(currentWallet);
      try {
        const updateConfig = async () => {
          const gaiaHubConfig = await createWalletGaiaConfig({
            gaiaHubUrl: gaiaUrl,
            wallet: newWallet,
          });
          await updateWalletConfig({
            wallet: newWallet,
            gaiaHubConfig,
          });
        };
        await updateConfig();
      } catch (e) {
        console.error('cant update wallet config', e);
      }
      setCurrentWallet(newWallet);
      setSelectedAccountIndexState(newWallet.accounts.length - 1);
    }
  };

  const switchAccount = (accountIndex: number) => {
    setSelectedAccountIndexState(accountIndex);
  };

  const estimateTransactionFees = async (
    asset: AccountToken,
    recipientAddress: string,
    amount: number,
    memo?: string,
  ) => {
    if (!selectedAccountState || !selectedAccountState.address) {
      throw new Error('No account selected');
    }

    const stxAddress = selectedAccountState.address;

    const makeTransaction = (): Promise<StacksTransaction> => {
      if (asset.name === 'STX') {
        return makeSTXTransaction(
          recipientAddress,
          amount,
          undefined,
          undefined,
          memo,
        );
      } else if (asset.isFungible) {
        return makeFTTransferTransaction(
          asset,
          recipientAddress,
          amount,
          undefined,
          undefined,
          memo,
        );
      }

      throw new Error('Unsupported asset transfer type.');
    };

    const transaction = await makeTransaction();
    const estimatedLen = transaction.serialize().byteLength;

    let payload;

    if (asset.name === 'STX') {
      payload = createTokenTransferPayload(recipientAddress, amount, memo);
    } else if (asset.isFungible) {
      if (!asset.contractName || !asset.contractAddress) {
        throw new Error('Missing asset metadata.');
      }

      const realAmount = ftUnshiftDecimals(
        amount || 0,
        asset?.metaData?.decimals || 0,
      );
      const functionArgs: ClarityValue[] = [
        uintCV(realAmount),
        standardPrincipalCVFromAddress(createAddress(stxAddress)),
        standardPrincipalCVFromAddress(createAddress(recipientAddress)),
      ];

      if (memo) {
        functionArgs.push(someCV(bufferCVFromString(memo)));
      } else {
        functionArgs.push(noneCV());
      }

      payload = createContractCallPayload(
        createAddress(asset.contractAddress),
        asset.contractName,
        'transfer',
        functionArgs,
      );
    } else {
      throw Error('Unsupported asset transfer type.');
    }

    const estimates = await estimateTransaction(
      payload,
      estimatedLen,
      network.stacksNetwork,
    );

    return getFeeEstimationsWithMaxValues(estimates);
  };

  const makeSTXTransaction = async (
    recipientAddress: string,
    amount: number,
    fee?: number,
    nonce?: bigint,
    memo?: string,
  ): Promise<StacksTransaction> => {
    if (!selectedAccountState || !selectedAccountState.address) {
      throw new Error('No account selected');
    }

    const options: SignedTokenTransferOptions = {
      recipient: recipientAddress,
      amount: stxToMicroStx(amount).toString(),
      senderKey: selectedAccountState.stxPrivateKey,
      network: network.stacksNetwork,
      anchorMode: AnchorMode.Any,
      memo,
      fee: new BN(stxToMicroStx(fee || 0).toNumber()),
      nonce: nonce ?? 0,
    };

    return makeSTXTokenTransfer(options);
  };

  const makeFTTransferTransaction = async (
    asset: AccountToken,
    recipientAddress: string,
    amount: number,
    fee?: number,
    nonce?: bigint,
    memo?: string,
  ): Promise<StacksTransaction> => {
    if (!selectedAccountState || !selectedAccountState.address) {
      throw new Error('No account selected');
    }

    const { address: stxAddress, stxPrivateKey } = selectedAccountState;
    const { name: assetName, contractName, contractAddress } = asset;
    if (!stxAddress || !contractName || !contractAddress) {
      throw new Error('Missing FT asset metadata');
    }

    const realAmount = ftUnshiftDecimals(
      amount || 0,
      asset?.metaData?.decimals || 0,
    );

    const assetInfo = createAssetInfo(stxAddress, contractName, assetName);
    const postConditions = [
      makeStandardFungiblePostCondition(
        stxAddress,
        FungibleConditionCode.Equal,
        new BN(realAmount, 10),
        assetInfo,
      ),
    ];

    const functionArgs: ClarityValue[] = [
      uintCV(realAmount),
      standardPrincipalCVFromAddress(createAddress(stxAddress)),
      standardPrincipalCVFromAddress(createAddress(recipientAddress)),
    ];

    if (memo) {
      functionArgs.push(someCV(bufferCVFromString(memo)));
    } else {
      functionArgs.push(noneCV());
    }

    const options: UnsignedContractCallOptions = {
      contractAddress,
      contractName,
      functionName: 'transfer',
      functionArgs,
      network: network.stacksNetwork,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
      postConditions,
      fee: new BN(stxToMicroStx(fee ?? 0).toNumber()),
      publicKey: publicKeyToString(pubKeyfromPrivKey(stxPrivateKey)),
      nonce: nonce ?? 0,
    };

    const tx = await makeUnsignedContractCall(options);
    const signer = new TransactionSigner(tx);
    signer.signOrigin(createStacksPrivateKey(stxPrivateKey));

    return tx;
  };

  const sendTransaction = async (
    asset: AccountToken,
    recipientAddress: string,
    amount: number,
    fee: number,
    memo?: string,
  ) => {
    const makeTransaction = (nonce: bigint): Promise<StacksTransaction> => {
      if (asset.name === 'STX') {
        return makeSTXTransaction(recipientAddress, amount, fee, nonce, memo);
      } else if (asset.isFungible) {
        return makeFTTransferTransaction(
          asset,
          recipientAddress,
          amount,
          fee,
          nonce,
          memo,
        );
      }

      throw new Error('Unsupported asset transfer type.');
    };

    if (selectedAccountState?.address === undefined) {
      return;
    }

    let nextNonce: bigint | undefined;
    let txSendResult: TxBroadcastResult | undefined;
    for (let i = 0; i < MAX_NONCE_INCREMENT_RETRIES; i++) {
      const tx = await makeTransaction(nextNonce ?? BigInt(0));
      txSendResult = await broadcastTransaction(tx, network.stacksNetwork);
      console.log(txSendResult);
      if (!txSendResult.error) {
        break;
      }

      const errMsg = txSendResult.reason?.toString();
      if (errMsg?.includes('ConflictingNonceInMempool')) {
        nextNonce = tx.auth.spendingCondition.nonce + BigInt(1);
      } else if (errMsg?.includes('BadNonce')) {
        const expectedNonce = (txSendResult as BadNonceRejection)?.reason_data
          ?.expected;
        nextNonce = expectedNonce ? BigInt(expectedNonce) : undefined;
      }
    }

    return txSendResult;
  };

  return {
    walletAccounts,
    selectedAccountState,
    selectedAccountIndexState,
    createAccount,
    switchAccount,
    estimateTransactionFees,
    sendTransaction,
  };
};

export function useAccountAvailableStxBalance(address: string) {
  return useAtomValue(accountAvailableStxBalanceState(address));
}

export function getFeeEstimationsWithMaxValues(
  feeEstimations: FeeEstimation[],
) {
  const feeEstimationsMaxValues = [500000, 750000, 2000000];
  return feeEstimations.map((feeEstimation, index) => {
    const level =
      index === 0
        ? EstimationsLevels.Low
        : index === 1
        ? EstimationsLevels.Middle
        : EstimationsLevels.High;
    if (
      feeEstimationsMaxValues &&
      new BigNumber(feeEstimation.fee).isGreaterThan(
        feeEstimationsMaxValues[index],
      )
    ) {
      return { fee: feeEstimationsMaxValues[index], fee_rate: 0, level };
    } else {
      return { ...feeEstimation, level };
    }
  });
}
