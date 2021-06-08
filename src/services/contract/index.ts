/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-cycle */
/* eslint-disable class-methods-use-this */
import BigNumber from 'bignumber.js/bignumber';

import { contracts } from '../../config';
import { AppStore } from '../../store';
import { IData, IDataContract } from '../../types';
import { clog, clogData, clogGroup, dataToObject, normalizedValue, notify } from '../../utils';

export class ContractService {
  private store: any;
  private staking: any;
  private token: any;

  constructor(appstore: AppStore) {
    this.store = appstore;
    this.staking = this.store.contracts.Staking.methods;
    this.token = this.store.contracts.Token.methods;
  }

  public async getTotalStakers(): Promise<IDataContract> {
    const data: IDataContract = await this.staking
      .nowTotalStakers()
      .call()
      .then((value: string) => {
        clog(`nowTotalStakers (tokenPrize): ${value}`);
        return {
          key: 'tokenPrize',
          value: normalizedValue(value),
        };
      });

    return data;
  }

  public async getTotalSupply(): Promise<IDataContract> {
    const data: IDataContract = await this.token
      .totalSupply()
      .call()
      .then((value: string) => {
        clog(`totalSupply (totalSupply): ${value}`);
        return {
          key: 'totalSupply',
          value: normalizedValue(value),
        };
      });

    return data;
  }

  public async getNowTotalMined(): Promise<IDataContract> {
    const data: IDataContract = await this.staking
      .nowTotalMined()
      .call()
      .then((value: string) => {
        clog(`nowTotalMined (alreadyStaked): ${value}`);
        return {
          key: 'alreadyStaked',
          value: normalizedValue(value),
        };
      });

    return data;
  }

  public async getBalanceOfLocked(): Promise<IDataContract> {
    const data: IDataContract = await this.token
      .balanceOfLocked(this.store.account.address)
      .call()
      .then((value: string) => {
        clog(`balanceOfLocked (availableToStakeLocked): ${value}`);
        return {
          key: 'availableToStakeLocked',
          value: normalizedValue(value),
        };
      });

    return data;
  }

  public async getBalanceOfSum(): Promise<IDataContract> {
    const data: IDataContract = await this.token
      .balanceOfSum(this.store.account.address)
      .call()
      .then((value: string) => {
        clog(`balanceOfSum (availableToStake): ${value}`);
        return {
          key: 'availableToStake',
          value: normalizedValue(value),
        };
      });

    return data;
  }

  public async getBalanceOf(): Promise<IDataContract> {
    const data: IDataContract = await this.token
      .balanceOf(this.store.account.address)
      .call()
      .then((value: string) => {
        clog(`balanceOf (balanceOf): ${value}`);
        const balance = normalizedValue(value);
        this.store.updateAccount({ balance });
        return {
          key: 'balanceOf',
          value: balance,
        };
      });

    return data;
  }

  public async getUserStakes(): Promise<IDataContract> {
    const data: IDataContract = await this.staking
      .userStakes(this.store.account.address)
      .call()
      .then((value: string) => {
        clog(`userStakes (userStakes): ${value[1]}`);
        return {
          key: 'userStakes',
          value: normalizedValue(value[1]),
        };
      });

    return data;
  }

  public async getUserReward(day?: string): Promise<IDataContract> {
    const data: IDataContract = await this.staking
      ._calculationReward(this.store.account.address, day || '0')
      .call()
      .then((value: string) => {
        clog(`_calculationReward (availableToClaim): ${value[0]}`);
        return {
          key: 'availableToClaim',
          value: normalizedValue(value[0], 0),
        };
      });

    return data;
  }

  public async getUserTh(): Promise<IDataContract> {
    return this.getUserStakes().then((data: IDataContract) => {
      const th = new BigNumber(data.value).div(this.store.decimals).multipliedBy(0.01).toString();
      clog(`userStakes (th): ${th}`);
      return {
        key: 'th',
        value: th,
      };
    });
  }

  public stakingInfo = async (): Promise<IData> => {
    clogGroup('Staking contract values: contract method (template data): contract value');

    const promises = [
      this.getTotalStakers(),
      this.getTotalSupply(),
      this.getNowTotalMined(),
      this.getBalanceOfLocked(),
      this.getBalanceOfSum(),
      this.getBalanceOf(),
      this.getUserStakes(),
    ];

    return Promise.all(promises)
      .then((res) => {
        clogGroup('End', true);
        return res;
      })
      .then((results): IData => {
        return dataToObject(results, true, 'Staking normilized values');
      });
  };

  public miningInfo = async (): Promise<IData> => {
    clogGroup('Mining contract values: contract method (template data): contract value');

    const promises = [this.getUserReward(), this.getUserTh()];

    return Promise.all(promises)
      .then((res) => {
        clogGroup('End', true);
        return res;
      })
      .then((results): IData => {
        return dataToObject(results, true, 'Mining normilized values');
      });
  };

  public getAllowance(amount: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.staking
        .allowance(this.store.account.address, contracts.params.TOKEN[contracts.type].address)
        .call()
        .then((allowance: string) => {
          const allow = new BigNumber(allowance);
          const allowed = allow.minus(amount);
          clog(`allowance: ${allowance}`);
          allowed.isNegative() ? reject() : resolve(1);
        });
    });
  }

  public sendToStaking(resolve: any, reject: any, amount: string, lAmount: string): Promise<any> {
    return this.staking
      .stakeStart(amount, lAmount)
      .send({
        from: this.store.account.address,
      })
      .then((tx: any) => {
        clogData('stake: ', tx);
        return { 0: true, 1: tx.transactionHash };
      })
      .then(resolve, reject);
  }

  public startStake(amount: string, lAmount: string): Promise<any> {
    notify('Please wait, staking is in progress.', 'info');

    return new Promise((resolve, reject) => {
      this.getAllowance(amount).then(
        () => {
          this.sendToStaking(resolve, reject, amount, lAmount);
        },
        () => {
          this.token
            .approve(contracts.params.STAKING[contracts.type].address, amount)
            .send({
              from: this.store.account.address,
            })
            .then(() => {
              this.sendToStaking(resolve, reject, amount, lAmount);
            }, reject);
        },
      );
    });
  }

  public async withdrow(): Promise<any> {
    return this.staking
      .stakeEnd()
      .send({
        from: this.store.account.address,
      })
      .then((data: any) => {
        clogData('withdrow: ', data);
        return data;
      });
  }

  public async withdrowAllReward(): Promise<any> {
    return this.staking
      .withdrawRewardAll()
      .send({
        from: this.store.account.address,
      })
      .then((data: any) => {
        clogData('withdrawRewardAll: ', data);
        return data;
      });
  }
}

// this.getDataFromContract('alreadyStaked', 'nowTotalMined()', 'Staking', true),

// public async getDataFromContract(
//   name: string,
//   useMethod: any,
//   contractName: string,
//   normilize = false,
// ): Promise<IDataContract> {
//   const data: IDataContract = await this.store.contracts[contractName]
//     .methods(() => useMethod)
//     .call()
//     .then((value: string) => {
//       clog(`${useMethod} (${name}): ${value}`);
//       return {
//         key: name,
//         value: normilize ? normalizedValue(value) : value,
//       };
//     });

//   return data;
// }
