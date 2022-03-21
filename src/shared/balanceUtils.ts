import BigNumber from 'bignumber.js';
import { MEMO_MAX_LENGTH_BYTES } from '@stacks/transactions';

export function initBigNumber(num: string | number | BigNumber) {
  return BigNumber.isBigNumber(num) ? num : new BigNumber(num);
}

export const abbreviateNumber = (n: number) => {
  if (n < 1e3) {
    return n.toString();
  }
  if (n >= 1e3 && n < 1e6) {
    return +(n / 1e3).toFixed(2) + 'K';
  }
  if (n >= 1e6 && n < 1e9) {
    return +(n / 1e6).toFixed(2) + 'M';
  }
  if (n >= 1e9 && n < 1e12) {
    return +(n / 1e9).toFixed(2) + 'B';
  }
  if (n >= 1e12) {
    return +(n / 1e12).toFixed(2) + 'T';
  }
  return n.toString();
};

export const stacksValue = ({
  value,
  fixedDecimals = true,
  withTicker = true,
  abbreviate = false,
}: {
  value: number | string | BigNumber;
  fixedDecimals?: boolean;
  withTicker?: boolean;
  abbreviate?: boolean;
}) => {
  const stacks = microStxToStx(value);
  const stxAmount = stacks.toNumber();
  return `${
    abbreviate && stxAmount > 10000
      ? abbreviateNumber(stxAmount)
      : stxAmount.toLocaleString('en-US', {
          maximumFractionDigits: fixedDecimals ? STX_DECIMALS : 2,
        })
  }${withTicker ? ' STX' : ''}`;
};
export const valueFromBalance = (
  balance: BigNumber,
  type: string,
  meta?: any,
) =>
  type === 'ft'
    ? ftDecimals(balance, meta?.decimals || 0)
    : type === 'stx' || type === 'STX'
    ? stacksValue({
        value: balance || 0,
        withTicker: false,
        fixedDecimals: meta?.fixedDecimals,
      })
    : balance.toString();

export const STX_DECIMALS = 6;

export const microStxToStx = (mStx: number | string | BigNumber) => {
  const microStacks = initBigNumber(mStx);
  return microStacks.shiftedBy(-STX_DECIMALS);
};
export const stxToMicroStx = (stx: number | string | BigNumber) => {
  const stxBN = initBigNumber(stx);
  return stxBN.shiftedBy(STX_DECIMALS);
};
const exceedsMaxLengthBytes = (
  string: string,
  maxLengthBytes: number,
): boolean => (string ? Buffer.from(string).length > maxLengthBytes : false);

export const isTxMemoValid = (memo: string) => {
  return !exceedsMaxLengthBytes(memo, MEMO_MAX_LENGTH_BYTES);
};
export const ftDecimals = (
  value: number | string | BigNumber,
  decimals: number,
) => {
  const amount = initBigNumber(value);
  return amount
    .shiftedBy(-decimals)
    .toNumber()
    .toLocaleString('en-US', { maximumFractionDigits: decimals });
};

const getContractName = (value: string) => {
  if (value.includes('.')) {
    var parts = value == null ? void 0 : value.split('.');

    if (value.includes('::')) {
      return parts[1].split('::')[0];
    }

    return parts[1];
  }

  console.warn(
    'getContractName: does not contain a period, does not appear to be a contract_id.',
    {
      value: value,
    },
  );
  return value;
};
const getAssetName = (fullyQualifiedName: string) => {
  if (!fullyQualifiedName.includes('::')) {
    console.warn(
      'getAssetName: does not contain "::", does not appear to be a fully qualified name of an asset.',
      {
        fullyQualifiedName: fullyQualifiedName,
      },
    );
    return fullyQualifiedName;
  }

  return fullyQualifiedName.split('::')[1];
};
export const getAssetStringParts = (fullyQualifiedName: string) => {
  if (!fullyQualifiedName.includes('.') || !fullyQualifiedName.includes('::')) {
    console.warn(
      'getAssetStringParts: does not contain a period or "::", does not appear to be a fully qualified name of an asset.',
      {
        fullyQualifiedName: fullyQualifiedName,
      },
    );
    return {
      address: fullyQualifiedName,
      contractName: fullyQualifiedName,
      assetName: fullyQualifiedName,
    };
  }

  var address = fullyQualifiedName.split('.')[0];
  var contractName = getContractName(fullyQualifiedName);
  var assetName = getAssetName(fullyQualifiedName);
  return {
    address: address,
    contractName: contractName,
    assetName: assetName,
  };
};
