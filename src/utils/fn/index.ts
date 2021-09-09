/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import BigNumber from 'bignumber.js/bignumber';

import { contracts } from '../../config';
import { IData, IDataContract } from '../../types';
import { clog, clogGroup } from '../logger';

export const normalizedValue = (
  value: string | number,
  number = false,
  fixed?: number,
): number | string => {
  const decimals = 10 ** contracts.decimals;
  const amount = new BigNumber(value).div(decimals);
  const amountDecimals = amount.decimalPlaces();
  const amountReturn = amount.toNumber();

  // return number
  //   ? fixed === 0
  //     ? +amountReturn
  //     : +amountReturn.toFixed(fixed || amountDecimals)
  //   : amountReturn.toString();

  return number
    ? fixed === 0
      ? +amountReturn
      : +amount.toFixed(fixed || amountDecimals)
    : amount.toFixed(amountDecimals);
  // : amountReturn.toString(amountDecimals <= 2 ? 2 : amountDecimals >= 18 ? 18 : amountDecimals);
};

export const deNormalizedValue = (value: string | number, fixed = false): string => {
  const decimals = 10 ** contracts.decimals;
  const amount = new BigNumber(value).multipliedBy(decimals);
  return fixed ? amount.toFixed(0) : amount.toString();
};

export const dataToObject = (data: any, log?: boolean, logName?: string): IData => {
  const values: any = {};

  if (log) clogGroup(logName || 'Object');

  data.forEach((v: IDataContract) => {
    if (log) clog(`${v.key}: ${v.value}`);
    values[v.key] = v.value;
  });

  if (log) clogGroup('End', true);

  return values;
};

export const isAddress = (address: string): boolean => {
  if (address.length !== 42) return false;
  if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) return false;
  if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) return true;
  return true;
};
