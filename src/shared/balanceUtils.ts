import BigNumber from 'bignumber.js';

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
          maximumFractionDigits: fixedDecimals ? STX_DECIMALS : 3,
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
    : type === 'stx'
    ? stacksValue({ value: balance || 0, withTicker: false })
    : balance.toString();

export const STX_DECIMALS = 6;

export const microStxToStx = (mStx: number | string | BigNumber) => {
  const microStacks = initBigNumber(mStx);
  return microStacks.shiftedBy(-STX_DECIMALS);
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
