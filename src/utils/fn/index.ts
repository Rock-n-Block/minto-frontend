import BigNumber from 'bignumber.js/bignumber';
import { contracts } from '../../config';

export const normalizedValue = (value: string | number, fixed?: number): number => {
  const decimals = 10 ** contracts.decimals;
  const normalValue = new BigNumber(value).div(decimals).toNumber();
  return +normalValue.toFixed(fixed || 4);
};
