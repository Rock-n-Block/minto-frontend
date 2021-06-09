/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import BigNumber from 'bignumber.js/bignumber';

import { contracts } from '../../config';
import { IData, IDataContract } from '../../types';
import { clog, clogGroup } from '../logger';

export const normalizedValue = (value: string | number, fixed?: number): number => {
  const decimals = 10 ** contracts.decimals;
  const amount = new BigNumber(value).div(decimals).toNumber();
  return fixed === 0 ? +amount : +amount.toFixed(fixed || 4);
};

export const deNormalizedValue = (value: string | number): string => {
  const decimals = 10 ** contracts.decimals;
  const amount = new BigNumber(value).multipliedBy(decimals).toString();
  return amount;
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