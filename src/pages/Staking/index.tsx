import React from 'react';
import BigNumber from 'bignumber.js/bignumber';
import CSS from 'csstype';
import { autorun } from 'mobx';

import { Procedure } from '../../components/organisms';
import { StakingInfo } from '../../components/sections';
import { config, contracts } from '../../config';
import { useStore } from '../../store';

import './Staking.scss';

interface IStakingInfo {
  tokenPrize: string;
  totalSupply: string;
  alreadyStaked: string;
  availableToStake: string;
  availableToStakeLocked: string;
  balanceOf: string;
  inWallet: string;
  userStakes: string;
}

const Staking: React.FC = () => {
  const store = useStore();

  const [stakingInfo, setStakingInfo] = React.useState({} as IStakingInfo);
  const [firstStart, setFirstStart] = React.useState(true);

  const [stakingValue, setStakingValue] = React.useState(0);
  const [withdrawValue, setWithdrawValue] = React.useState(0);

  const [stakingProgress, setStakingProgress] = React.useState(false);
  const [withdrawProgress, setWithdrawProgress] = React.useState(false);

  const normalizedValue = (value: string | number, fixed?: number): number => {
    const decimals = 10 ** contracts.decimals;
    const normalValue = new BigNumber(value).div(decimals).toNumber();
    return +normalValue.toFixed(fixed || 4);
  };

  const getStakingInfo = async () => {
    const decimals = new BigNumber(10).pow(contracts.decimals).toString();
    store.setDecimals(decimals);
    // console.log('decimals', store.decimals);

    setFirstStart(false);

    // console.log(store.contracts.Staking);
    // console.log(store.account.address);

    const promises = [
      store.contracts.Staking.methods
        .nowTotalStakers()
        .call()
        .then((value: string) => {
          console.log('nowTotalStakers', value);
          return {
            key: 'tokenPrize',
            value: normalizedValue(value),
          };
        }),
      // From Token Contract
      store.contracts.Token.methods
        .totalSupply()
        .call()
        .then((value: string) => {
          console.log('totalSupply', value);
          return {
            key: 'totalSupply',
            value: normalizedValue(value),
          };
        }),
      store.contracts.Staking.methods
        .nowTotalMined()
        .call()
        .then((value: string) => {
          console.log('nowTotalMined', value);
          return {
            key: 'alreadyStaked',
            value: normalizedValue(value),
          };
        }),
      store.contracts.Token.methods
        .balanceOfLocked(store.account.address)
        .call()
        .then((value: string) => {
          console.log(value);
          return {
            key: 'availableToStakeLocked',
            value: normalizedValue(value),
          };
        }),
      store.contracts.Token.methods
        .balanceOfSum(store.account.address)
        .call()
        .then((value: string) => {
          console.log(value);
          const balance = new BigNumber(value)
            .div(new BigNumber(10).pow(contracts.decimals))
            .toString();
          store.updateAccount({ balance });
          return {
            key: 'availableToStake',
            value: new BigNumber(value).div(store.decimals).toString(),
          };
        }),
      store.contracts.Token.methods
        .balanceOf(store.account.address)
        .call()
        .then((value: string) => {
          console.log(value);
          const balance = new BigNumber(value)
            .div(new BigNumber(10).pow(contracts.decimals))
            .toString();
          store.updateAccount({ balance });
          return {
            key: 'balanceOf',
            value: normalizedValue(value),
          };
        }),
      store.contracts.Staking.methods
        .userStakes(store.account.address)
        .call()
        .then((value: string) => {
          console.log('userStakes', value);
          return {
            key: 'userStakes',
            value: normalizedValue(value[1]),
          };
        }),
    ];

    const nstakingInfo = await Promise.all(promises).then((results): Promise<IStakingInfo> => {
      const values: any = {};
      results.forEach((v: { key: string; value: string }) => {
        console.log(v);
        values[v.key] = v.value;
      });
      return values;
    });

    setStakingInfo(nstakingInfo);
  };

  const getAllowance = (amount: string) => {
    return new Promise((resolve, reject) => {
      store.contracts.Token.methods
        .allowance(store.account.address, contracts.params.TOKEN[contracts.type].address)
        .call()
        .then((allowance: string) => {
          const allow = new BigNumber(allowance);
          const allowed = allow.minus(amount);
          console.log('allowance', allowance);
          allowed.isNegative() ? reject() : resolve(1);
        });
    });
  };

  const stake = (resolve: any, reject: any, amount: string, lAmount: string) => {
    return store.contracts.Staking.methods
      .stakeStart(amount, lAmount)
      .send({
        from: store.account.address,
      })
      .then((tx: any) => {
        const { transactionHash } = tx;
        console.log('stake', tx, transactionHash);
        return true;
      })
      .then(resolve, reject);
  };

  const startstake = (amount: string, lAmount: string) => {
    // console.log(amount, lAmount);

    return new Promise((resolve, reject) => {
      getAllowance(amount).then(
        () => {
          stake(resolve, reject, amount, lAmount);
        },
        () => {
          store.contracts.Token.methods
            .approve(contracts.params.STAKING[contracts.type].address, amount)
            .send({
              from: store.account.address,
            })
            .then(() => {
              stake(resolve, reject, amount, lAmount);
            }, reject);
        },
      );
    });
  };

  const handleChangeStakingAmount = (value: any) => {
    // console.log(value, value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'));
    // setStakingValue(value.replace(/[^0-9]/g, ''));
    setStakingValue(value);
    if (value < 0) setStakingValue(0);
    if (value > +stakingInfo.balanceOf) setStakingValue(+stakingInfo.balanceOf);
  };

  const handleButtonStakingClick = () => {
    if (+stakingValue === 0 || +stakingValue <= 0) return;
    setStakingProgress(true);
    const amount = new BigNumber(stakingValue).multipliedBy(store.decimals).toString();

    startstake(amount, '0')
      .then(
        (data: any) => {
          console.log('got staking: ', data);
          setTimeout(() => {
            getStakingInfo();
          }, 10000);
        },
        (err: any) => {
          console.log('staking error: ', err);
        },
      )
      .finally(() => setStakingProgress(false));
  };

  const handleChangeWithdrawAmount = (value: any) => {
    setWithdrawValue(value);
    if (value < 0) setWithdrawValue(0);
    if (value > +stakingInfo.userStakes) setWithdrawValue(+stakingInfo.userStakes);
  };

  const handleFullButtonStakingClick = (value: any) => {
    setStakingValue(value);
    setStakingValue(+stakingInfo.balanceOf);
  };

  const handleFullButtonWithdrawClick = () => {
    setWithdrawValue(+stakingInfo.userStakes);
  };

  const handleButtonWithdrawClick = () => {
    setWithdrawProgress(true);
    store.contracts.Staking.methods
      .stakeEnd()
      .send({
        from: store.account.address,
      })
      .then(
        (info: any) => {
          console.log('got withdraw', info);
          setTimeout(() => {
            getStakingInfo();
          }, 10000);
        },
        (err: any) => console.log('withdraw err: ', err),
      )
      .finally(() => setWithdrawProgress(false));
  };

  autorun(() => {
    if (!store.account.address) return;
    if (!firstStart) return;
    getStakingInfo();
  });

  React.useEffect(() => {
    if (!store.account.address) return;
    if (!firstStart) return;
    getStakingInfo();
  });

  React.useEffect(() => {
    if (!store.account.address && config.menu.onlyForAuth) {
      store.toggleWalletMenu(true);
    }
  }, [store]);

  const h1Styles: CSS.Properties = {
    bottom: '2rem',
    padding: '0.5rem',
    fontFamily: 'sans-serif',
    fontSize: '1.5rem',
    textAlign: 'center',
    color: 'black',
    marginTop: '250px',
    marginBottom: '150px',
  };

  return (
    <div className="staking">
      {store.account.address ? (
        <StakingInfo info={stakingInfo} token="BTCMT" />
      ) : (
        <div style={h1Styles}>
          <span className="links__title text-center text text-black text-bold-e">
            Please LogIn to see Information
          </span>
        </div>
      )}

      {store.account.address ? (
        <div>
          <Procedure
            title="Stake your tokens"
            info={[
              {
                title: 'In your wallet',
                value: `${stakingInfo.balanceOf} BTCMT`,
              },
              {
                title: 'You already staked',
                value: `${stakingInfo.userStakes} BTCMT`,
              },
            ]}
            inputTitle="Amount to stake"
            btnAllText="All available"
            submitBtnText="Stake"
            inputType="Staking"
            inputChange={handleChangeStakingAmount}
            inputMax={+stakingInfo.balanceOf}
            inputValue={stakingValue}
            btnProcessed={stakingProgress}
            btnProcessedText="Processing..."
            btnClick={handleFullButtonStakingClick}
            buttonClick={handleButtonStakingClick}
          />
          <Procedure
            title="Withdraw"
            theme="light"
            info={[
              {
                title: 'You already staked',
                value: `${stakingInfo.userStakes} BTCMT`,
              },
            ]}
            miniButtonShow={false}
            inputTitle="Amount to Withdraw"
            btnAllText="All available"
            submitBtnText="Withdraw"
            inputButtonShow={false}
            inputType="Withdraw"
            inputMax={+stakingInfo.userStakes}
            inputChange={handleChangeWithdrawAmount}
            inputValue={withdrawValue}
            btnProcessed={withdrawProgress}
            btnProcessedText="Processing..."
            btnClick={handleFullButtonWithdrawClick}
            buttonClick={handleButtonWithdrawClick}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Staking;
