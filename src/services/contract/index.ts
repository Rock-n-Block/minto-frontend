/* eslint-disable class-methods-use-this */
import BigNumber from 'bignumber.js/bignumber';

import { contracts } from '../../config';
import { AppStore } from '../../store';
import { IMinigInfo, IStakingInfo } from '../../types';
import { normalizedValue, clog } from '../../utils';

export class ContractService {
  private store: any;

  constructor(appstore: AppStore) {
    this.store = appstore;
    console.log('store', appstore);
  }

  public stakingInfo = async (): Promise<IStakingInfo> => {
    const promises = [
      this.store.contracts.Staking.methods
        .nowTotalStakers()
        .call()
        .then((value: string) => {
          clog(`nowTotalStakers (tokenPrize): ${value}`);
          return {
            key: 'tokenPrize',
            value: normalizedValue(value),
          };
        }),
      this.store.contracts.Token.methods
        .totalSupply()
        .call()
        .then((value: string) => {
          clog(`totalSupply (totalSupply): ${value}`);
          return {
            key: 'totalSupply',
            value: normalizedValue(value),
          };
        }),
      this.store.contracts.Staking.methods
        .nowTotalMined()
        .call()
        .then((value: string) => {
          clog(`nowTotalMined (alreadyStaked): ${value}`);
          return {
            key: 'alreadyStaked',
            value: normalizedValue(value),
          };
        }),
      this.store.contracts.Token.methods
        .balanceOfLocked(this.store.account.address)
        .call()
        .then((value: string) => {
          clog(`balanceOfLocked (availableToStakeLocked): ${value}`);
          return {
            key: 'availableToStakeLocked',
            value: normalizedValue(value),
          };
        }),
      this.store.contracts.Token.methods
        .balanceOfSum(this.store.account.address)
        .call()
        .then((value: string) => {
          clog(`balanceOfSum (availableToStake): ${value}`);
          const balance = new BigNumber(value)
            .div(new BigNumber(10).pow(contracts.decimals))
            .toString();
          this.store.updateAccount({ balance });
          return {
            key: 'availableToStake',
            value: new BigNumber(value).div(this.store.decimals).toString(),
          };
        }),
      this.store.contracts.Token.methods
        .balanceOf(this.store.account.address)
        .call()
        .then((value: string) => {
          clog(`balanceOf (balanceOf): ${value}`);
          const balance = new BigNumber(value)
            .div(new BigNumber(10).pow(contracts.decimals))
            .toString();
          this.store.updateAccount({ balance });
          return {
            key: 'balanceOf',
            value: normalizedValue(value),
          };
        }),
      this.store.contracts.Staking.methods
        .userStakes(this.store.account.address)
        .call()
        .then((value: string) => {
          clog(`userStakes (userStakes): ${value}`);
          return {
            key: 'userStakes',
            value: normalizedValue(value[1]),
          };
        }),
    ];

    return Promise.all(promises).then((results): Promise<IStakingInfo> => {
      const values: any = {};
      console.group('Staking load');
      results.forEach((v: { key: string; value: string }) => {
        clog(`${v.key}: ${v.value}`);
        values[v.key] = v.value;
      });
      console.groupEnd();
      return values;
    });
  };

  public miningInfo = async (): Promise<IMinigInfo> => {
    const promises = [
      // eslint-disable-next-line no-underscore-dangle
      this.store.contracts.Staking.methods
        ._calculationReward(this.store.account.address, '0')
        .call()
        .then((value: string) => {
          clog(
            `_calculationReward (availableToClaim): ${value} (${Number(
              '91002763963364277',
            ).toLocaleString('fullwide', { useGrouping: false })})`,
          );
          return {
            key: 'availableToClaim',
            value: new BigNumber(value[0]).div(10 ** 18).toString(),
          };
        }),
      this.store.contracts.Staking.methods
        .userStakes(this.store.account.address)
        .call()
        .then((value: string) => {
          const th = new BigNumber(value[1]).div(this.store.decimals).multipliedBy(0.01).toString();
          clog(`userStakes (availableToClaim): ${value[1]}`);
          clog(`th: ${th}`);
          return {
            key: 'th',
            value: th,
          };
        }),
    ];

    return Promise.all(promises).then((results): Promise<IMinigInfo> => {
      const values: any = {};
      console.group('Mining load');
      results.forEach((v: { key: string; value: string }) => {
        clog(`${v.key}: ${v.value}`);
        values[v.key] = v.value;
      });
      console.groupEnd();
      return values;
    });
  };
}
