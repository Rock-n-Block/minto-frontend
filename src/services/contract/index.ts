/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-cycle */
/* eslint-disable class-methods-use-this */
import BigNumber from 'bignumber.js/bignumber';

import { contracts } from '../../config';
import { AppStore } from '../../store';
import { IData, IDataContract, IRoles } from '../../types';
import { clog, clogData, clogGroup, dataToObject, normalizedValue, notify } from '../../utils';
import i18n from '../../utils/i18n';

export class ContractService {
  private store: any;
  private staking: any;
  private token: any;
  private presale: any;
  private usdt: any;

  constructor(appstore: AppStore) {
    this.store = appstore;
    this.staking = this.store.contracts.Staking.methods;
    this.token = this.store.contracts.Token.methods;
    this.usdt = this.store.contracts.UsdtToken.methods;
    this.presale = this.store.contracts.Presale.methods;
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
        clog(`balanceOfLocked (availableLocked): ${value}`);
        return {
          key: 'availableLocked',
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

  public balanceOfSumStaking() {
    return this.token.balanceOfSum(contracts.params.STAKING[contracts.type].address).call();
  }

  public async getBalanceOf(): Promise<IDataContract> {
    const data: IDataContract = await this.token
      .balanceOf(this.store.account.address)
      .call()
      .then((value: string) => {
        clog(`balanceOf (availableUnlocked): ${value}`);
        const balance = normalizedValue(value);
        this.store.updateAccount({ balance });
        return {
          key: 'availableUnlocked',
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
        clogData('userStakes (userStakes):', value);
        return [
          {
            key: 'userStakesTotal',
            value: normalizedValue(value[1]),
          },
          {
            key: 'userStakesLocked',
            value: normalizedValue(value[2]),
          },
          {
            key: 'userStakesUnlocked',
            value: normalizedValue(value[3]),
          },
        ];
      });

    return data;
  }

  public async getUserReward(): Promise<IDataContract> {
    const data: IDataContract = await this.staking
      .getCurrentUserReward(this.store.account.address)
      .call()
      .then((value: string) => {
        clog(`getCurrentUserReward (availableToClaim): ${value}`);
        return {
          key: 'availableToClaim',
          value: normalizedValue(value), // .toLocaleString('fullwide', { useGrouping: false }),
        };
      });

    return data;
  }

  public async getUserTh(): Promise<IDataContract> {
    return this.getUserStakes().then((result: IDataContract) => {
      const data = dataToObject(result);
      const th = new BigNumber(data.userStakesTotal).multipliedBy(0.01).toString();
      clog(`userStakes (th): ${th}`);
      return {
        key: 'th',
        value: th,
      };
    });
  }

  // Presale Start

  public async getUsdtBalance(): Promise<IDataContract> {
    const data: IDataContract = await this.usdt
      .balanceOf(this.store.account.address)
      .call()
      .then((value: string) => {
        clog(`balanceOf (usdtBalance): ${value}`);
        return {
          key: 'usdtBalance',
          value: normalizedValue(value),
        };
      });

    return data;
  }

  public async getTotalSold(): Promise<IDataContract> {
    const data: IDataContract = await this.presale
      .totalSold()
      .call()
      .then((value: string) => {
        clog(`totalSold (totalSold): ${value}`);
        return {
          key: 'totalSold',
          value: normalizedValue(value),
          // value: 999999999999800000,
          // value: 1000000000000000000,
        };
      });

    return data;
  }

  public async getCapToSell(): Promise<IDataContract> {
    const data: IDataContract = await this.presale
      .capToSell()
      .call()
      .then((value: string) => {
        clog(`capToSell (capToSell): ${value}`);
        return {
          key: 'capToSell',
          value: normalizedValue(value),
        };
      });

    return data;
  }

  // Presale Finish

  // TODO: FIX Allowance for Unlocked Token
  public getAllowance(amount: string): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve) => {
      if (+amount === 0) resolve(1);

      resolve(-1);
      // this.staking
      //   .allowance(this.store.account.address, contracts.params.TOKEN[contracts.type].address)
      //   .call()
      //   .then((allowance: string) => {
      //     const allow = new BigNumber(allowance);
      //     const allowed = allow.minus(amount);
      //     clog(`allowance: ${allowance}`);
      //     allowed.isNegative() ? reject() : resolve(1);
      //   });
    });
  }

  // TODO: FIX Allowance for Locked Token
  public getAllowanceLocked(amount: string): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise((resolve) => {
      if (+amount === 0) resolve(1);

      resolve(-1);
      //   this.staking
      //     .allowance(this.store.account.address, contracts.params.TOKEN[contracts.type].address)
      //     .call()
      //     .then((allowance: string) => {
      //       const allow = new BigNumber(allowance);
      //       const allowed = allow.minus(amount);
      //       clog(`allowanceLocked: ${allowance}`);
      //       allowed.isNegative() ? reject() : resolve(1);
      //     });
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

  public async approveUnlocked(amount: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // debugger;
      return this.token
        .approve(contracts.params.STAKING[contracts.type].address, amount)
        .send({
          from: this.store.account.address,
        })
        .then((tx: any) => {
          clogData('approve (approve): ', tx);
          resolve({ 0: true, 1: tx.transactionHash });
        })
        .catch((err: any) => {
          clogData(`reject (approve): `, err);
          reject(err);
        });
    });
  }

  public async approveLocked(amount: string): Promise<any> {
    return new Promise((resolve, reject) => {
      return this.token
        .approveLocked(contracts.params.STAKING[contracts.type].address, amount)
        .send({
          from: this.store.account.address,
        })
        .then((tx: any) => {
          clogData('approve (approveLocked): ', tx);
          resolve({ 0: true, 1: tx.transactionHash });
        })
        .catch((err: any) => {
          clogData(`reject (approveLocked): `, err);
          reject(err);
        });
    });
  }

  public startStake(amount: string, lAmount: string): Promise<any> {
    notify(i18n.t('notifications.staking.wait'), 'info');

    return new Promise((resolve, reject) => {
      const promises = [this.getAllowance(amount), this.getAllowanceLocked(lAmount)];

      Promise.all(promises).then((res) => {
        if (res[0] === 0 && res[1] === 0) {
          return this.sendToStaking(resolve, reject, amount, lAmount);
        }

        const aprPromises = [] as Promise<any>[];

        if (res[0] !== 0 && res[0] < 0) aprPromises.push(this.approveUnlocked(amount));
        if (res[1] !== 0 && res[1] < 0) aprPromises.push(this.approveLocked(lAmount));

        return Promise.all(aprPromises)
          .then((result: any) => {
            clogData(`approveUnlocked and approveLocked result: `, result);
            return this.sendToStaking(resolve, reject, amount, lAmount);
          })
          .catch((err) => {
            clogData(`approveUnlocked and approveLocked err: `, err);
            reject(err);
          });
      });
    });
  }

  public presaleBuy(btcmt: string, usdt: string, percent: number): Promise<any> {
    notify(i18n.t('notifications.presale.wait'), 'info');

    const weeks: { [index: number]: string } = {
      0: '0',
      2: '4',
      4: '13',
      8: '26',
      10: '52',
      15: '104',
    };

    const getAllowance = (amount: string): Promise<any> => {
      return new Promise((resolve, reject) => {
        this.usdt
          .allowance(this.store.account.address, contracts.params.PRESALE[contracts.type].address)
          .call()
          .then((allowance: string) => {
            const allow = new BigNumber(allowance);
            const allowed = allow.minus(amount);
            clog(`allowance: ${allowance}`);
            allowed.isNegative() ? reject() : resolve(1);
          });
      });
    };

    const approveUsdt = (amount: string): Promise<any> => {
      return new Promise((resolve, reject) => {
        this.usdt
          .approve(contracts.params.PRESALE[contracts.type].address, usdt)
          .send({
            from: this.store.account.address,
          })
          .then((allowance: string) => {
            const allow = new BigNumber(allowance);
            const allowed = allow.minus(amount);
            clog(`allowance: ${allowance}`);
            allowed.isNegative() ? reject() : resolve(1);
          });
      });
    };

    const buyTokens = (
      resolve: any,
      reject: any,
      amount: string,
      weeksTo: string,
    ): Promise<any> => {
      return this.presale
        .buy(amount, weeksTo)
        .send({
          from: this.store.account.address,
        })
        .then((tx: any) => {
          clogData('stake: ', tx);
          return { 0: true, 1: tx.transactionHash };
        })
        .then(resolve, reject);
    };

    return new Promise((resolve, reject) => {
      getAllowance(usdt).then(
        () => {
          buyTokens(resolve, reject, btcmt, weeks[percent]);
        },
        () => {
          approveUsdt(usdt)
            .then((result: any) => {
              clogData(`approveUsdt result: `, result);
              return buyTokens(resolve, reject, btcmt, weeks[percent]);
            })
            .catch((err) => {
              clogData(`approveUsdt err: `, err);
              reject(err);
            });
        },
      );
    });
  }

  public async withdraw(): Promise<any> {
    notify(i18n.t('notifications.withdraw.wait'), 'info');

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

  public async withdrawPartially(lAmount: string, amount: string): Promise<any> {
    notify(i18n.t('notifications.withdraw.wait'), 'info');

    return this.staking
      .stakeEndPartially(lAmount, amount)
      .send({
        from: this.store.account.address,
      })
      .then((data: any) => {
        clogData('withdrawPartially: ', data);
        return data;
      });
  }

  public async mintLockedTokens(address: string, amount: string): Promise<any> {
    notify('Please wait, minting locked tokens is in progress.', 'info');

    return this.token
      .mintLocked(address, amount)
      .send({
        from: this.store.account.address,
      })
      .then((data: any) => {
        clogData('mint locked tokens: ', data);
        return data.transactionHash;
      });
  }

  public async claimAllReward(): Promise<any> {
    notify(i18n.t('notifications.minting.wait'), 'info');

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

  public async claimReward(amount: string): Promise<any> {
    notify(i18n.t('notifications.minting.wait'), 'info');

    return this.staking
      .withdrawRewardPartially(amount)
      .send({
        from: this.store.account.address,
      })
      .then((data: any) => {
        clogData('withdrawRewardPartially: ', data);
        return data;
      });
  }

  public async hasRole(role?: string): Promise<IRoles> {
    return this.token
      .hasRole(role || '0x00', this.store.account.address)
      .call()
      .then((data: any) => {
        clogData('hasRole: ', data);
        return {
          role: role || '0x00',
          has_role: data,
        };
      });
  }

  public stakingInfo = async (): Promise<IData> => {
    clogGroup('Staking contract values: contract method (template data): contract value');

    const promises = [
      this.getTotalStakers(),
      this.getTotalSupply(),
      this.getNowTotalMined(),
      this.getBalanceOf(),
      this.getBalanceOfLocked(),
      this.getBalanceOfSum(),
      this.getUserStakes(),
    ];

    return Promise.all(promises)
      .then((res) => {
        clogGroup('End', true);
        return res;
      })
      .then((results): IData => {
        return dataToObject(results.flat(), true, 'Staking normilized values');
      });
  };

  public presaleInfo = async (): Promise<IData> => {
    clogGroup('Presale contract values: contract method (template data): contract value');

    const promises = [this.getUsdtBalance(), this.getCapToSell(), this.getTotalSold()];

    return Promise.all(promises)
      .then((res) => {
        clogGroup('End', true);
        return res;
      })
      .then((results): IData => {
        return dataToObject(results.flat(), true, 'Presale normilized values');
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
}
