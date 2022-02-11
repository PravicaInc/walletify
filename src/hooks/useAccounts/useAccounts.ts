import { useAtomValue } from 'jotai/utils';
import {
  createWalletGaiaConfig,
  generateNewAccount,
  updateWalletConfig,
} from '@stacks/wallet-sdk/dist';
import {
  makeSTXTokenTransfer,
  broadcastTransaction,
  AnchorMode,
  SignedTokenTransferOptions,
  estimateTransaction,
  TxBroadcastResult,
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
import { createTokenTransferPayload } from '@stacks/transactions/dist/payload';

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
    recipientAddress: string,
    amount: number,
    memo?: string,
  ) => {
    const txOptions = {
      recipient: recipientAddress,
      amount: amount * 1000000, // To convert from micro STX to STX
      senderKey: selectedAccountState?.stxPrivateKey,
      memo: memo,
      anchorMode: AnchorMode.Any,
      network: network.stacksNetwork,
    } as SignedTokenTransferOptions;

    const transaction = await makeSTXTokenTransfer(txOptions);

    const estimatedLen = transaction.serialize().byteLength;
    const payload = createTokenTransferPayload(
      txOptions.recipient,
      txOptions.amount,
      txOptions.memo,
    );
    const txFee = await estimateTransaction(
      payload,
      estimatedLen,
      network.stacksNetwork,
    );

    // Cap the proposed fee to 2 STX
    return Math.min(Number(txFee[1].fee) / 1000000, 2);
  };

  const sendTransaction = async (
    recipientAddress: string,
    amount: number,
    fee: number,
    memo?: string,
  ) => {
    if (selectedAccountState?.address === undefined) {
      return;
    }

    let nextNonce: bigint | undefined;
    let txSendResult: TxBroadcastResult | undefined;
    for (let i = 0; i < MAX_NONCE_INCREMENT_RETRIES; i++) {
      const txOpts: SignedTokenTransferOptions = {
        recipient: recipientAddress,
        amount: BigInt((amount * 1000000).toString()), // To convert from STX to micro STX
        senderKey: selectedAccountState.stxPrivateKey,
        network: network.stacksNetwork,
        anchorMode: AnchorMode.Any,
        memo,
        fee: fee * 1000000, // To convert from STX to micro STX
      };
      if (nextNonce !== undefined) {
        txOpts.nonce = nextNonce;
      }
      const tx = await makeSTXTokenTransfer(txOpts);
      txSendResult = await broadcastTransaction(tx, network.stacksNetwork);

      if (txSendResult.error) {
        const errMsg = txSendResult.reason?.toString();
        if (errMsg?.includes('ConflictingNonceInMempool')) {
          nextNonce = tx.auth.spendingCondition.nonce + BigInt(1);
        } else if (errMsg?.includes('BadNonce')) {
          nextNonce = undefined;
        }
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
