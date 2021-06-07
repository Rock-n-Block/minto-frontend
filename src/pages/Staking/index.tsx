import React from 'react';
import BigNumber from 'bignumber.js/bignumber';
import CSS from 'csstype';
import { autorun } from 'mobx';

import { Procedure } from '../../components/organisms';
import { StakingInfo } from '../../components/sections';

import { useStore } from '../../store';
import { config, contracts } from '../../config';
import { ICustomNotifyData, IStakingInfo } from '../../types';
import { errCode, notify, clog } from '../../utils';

import IconExternalLink from '../../assets/img/icons/external-link.svg';
import './Staking.scss';

const Staking: React.FC = () => {
  const store = useStore();

  const [stakingInfo, setStakingInfo] = React.useState({} as IStakingInfo);
  const [firstStart, setFirstStart] = React.useState(true);

  const [stakingValue, setStakingValue] = React.useState(0);
  const [withdrawValue, setWithdrawValue] = React.useState(0);

  const [stakingProgress, setStakingProgress] = React.useState(false);
  const [withdrawProgress, setWithdrawProgress] = React.useState(false);

  const customNotify = (data: ICustomNotifyData) => {
    return (
      <div>
        <p className="custom-notify-text">{data.text}</p>
        {data.link ? (
          <div className="custom-notify-link-wrap">
            <a className="custom-notify-link" target="_blank" href={data.link.url} rel="noreferrer">
              <img width="15px" height="15px" src={IconExternalLink} alt="external link" />
              {data.link.text}
            </a>
          </div>
        ) : (
          ''
        )}
      </div>
    );
  };

  const getStakingInfo = async () => {
    const decimals = new BigNumber(10).pow(contracts.decimals).toString();
    store.setDecimals(decimals);

    setFirstStart(false);

    if (!store.is_contractService) {
      store.setContractService();
      console.log('info', store.contractService);
    }

    // clog(`decimals: ${store.decimals}`);
    // clog(`${store.contracts.Staking}`);
    // clog(`${store.account.address}`);

    // const promises = [
    //   store.contracts.Staking.methods
    //     .nowTotalStakers()
    //     .call()
    //     .then((value: string) => {
    //       clog(`nowTotalStakers (tokenPrize): ${value}`);
    //       return {
    //         key: 'tokenPrize',
    //         value: normalizedValue(value),
    //       };
    //     }),
    //   store.contracts.Token.methods
    //     .totalSupply()
    //     .call()
    //     .then((value: string) => {
    //       clog(`totalSupply (totalSupply): ${value}`);
    //       return {
    //         key: 'totalSupply',
    //         value: normalizedValue(value),
    //       };
    //     }),
    //   store.contracts.Staking.methods
    //     .nowTotalMined()
    //     .call()
    //     .then((value: string) => {
    //       clog(`nowTotalMined (alreadyStaked): ${value}`);
    //       return {
    //         key: 'alreadyStaked',
    //         value: normalizedValue(value),
    //       };
    //     }),
    //   store.contracts.Token.methods
    //     .balanceOfLocked(store.account.address)
    //     .call()
    //     .then((value: string) => {
    //       clog(`balanceOfLocked (availableToStakeLocked): ${value}`);
    //       return {
    //         key: 'availableToStakeLocked',
    //         value: normalizedValue(value),
    //       };
    //     }),
    //   store.contracts.Token.methods
    //     .balanceOfSum(store.account.address)
    //     .call()
    //     .then((value: string) => {
    //       clog(`balanceOfSum (availableToStake): ${value}`);
    //       const balance = new BigNumber(value)
    //         .div(new BigNumber(10).pow(contracts.decimals))
    //         .toString();
    //       store.updateAccount({ balance });
    //       return {
    //         key: 'availableToStake',
    //         value: new BigNumber(value).div(store.decimals).toString(),
    //       };
    //     }),
    //   store.contracts.Token.methods
    //     .balanceOf(store.account.address)
    //     .call()
    //     .then((value: string) => {
    //       clog(`balanceOf (balanceOf): ${value}`);
    //       const balance = new BigNumber(value)
    //         .div(new BigNumber(10).pow(contracts.decimals))
    //         .toString();
    //       store.updateAccount({ balance });
    //       return {
    //         key: 'balanceOf',
    //         value: normalizedValue(value),
    //       };
    //     }),
    //   store.contracts.Staking.methods
    //     .userStakes(store.account.address)
    //     .call()
    //     .then((value: string) => {
    //       clog(`userStakes (userStakes): ${value}`);
    //       return {
    //         key: 'userStakes',
    //         value: normalizedValue(value[1]),
    //       };
    //     }),
    // ];

    // const info = await Promise.all(promises).then((results): Promise<IStakingInfo> => {
    //   const values: any = {};
    //   console.group('Staking load');
    //   results.forEach((v: { key: string; value: string }) => {
    //     clog(`${v.key}: ${v.value}`);
    //     values[v.key] = v.value;
    //   });
    //   console.groupEnd();
    //   return values;
    // });

    const info = await store.contractService.stakingInfo();

    setStakingInfo(info);
  };

  const getAllowance = (amount: string) => {
    return new Promise((resolve, reject) => {
      store.contracts.Token.methods
        .allowance(store.account.address, contracts.params.TOKEN[contracts.type].address)
        .call()
        .then((allowance: string) => {
          const allow = new BigNumber(allowance);
          const allowed = allow.minus(amount);
          clog(`allowance: ${allowance}`);
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
        clog(`stake: ${tx} ${transactionHash}`);
        return { 0: true, 1: transactionHash };
      })
      .then(resolve, reject);
  };

  const startstake = (amount: string, lAmount: string) => {
    notify('Please wait, staking is in progress.', 'info');

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
    setStakingValue(value);
    if (value < 0) setStakingValue(0);
    if (value > +stakingInfo.balanceOf) setStakingValue(+stakingInfo.balanceOf);
  };

  const handleButtonStakingClick = () => {
    if (+stakingValue === 0 || +stakingValue <= 0) {
      notify('Please, input value in staking field.', 'warning');
      return;
    }

    setStakingProgress(true);
    const amount = new BigNumber(stakingValue).multipliedBy(store.decimals).toString();

    startstake(amount, '0')
      .then(
        (data: any) => {
          clog(`got staking: ${data} ${data[1]}`);
          setStakingValue(0);
          notify(
            customNotify({
              text: 'Your stake complete!',
              link: {
                url: `${config.tx.link}/${data[1]}`,
                text: 'View tx',
              },
            }),
            'success',
          );

          setTimeout(() => {
            getStakingInfo();
          }, 10000);
        },
        (err: any) => {
          clog(`staking error: ${err}`);
          notify(
            `Something went wrong! ${err.code === 4001 ? 'You denied transaction signature.' : ''}`,
            'error',
          );
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
    notify('Please wait, withdraw is in progress.', 'info');
    setWithdrawProgress(true);
    store.contracts.Staking.methods
      .stakeEnd()
      .send({
        from: store.account.address,
      })
      .then(
        (data: any) => {
          clog(`got withdraw: ${data}`);
          notify(
            customNotify({
              text: 'Your withdraw complete!',
              link: {
                url: `https://testnet.hecoinfo.com/tx/${data.transactionHash}`,
                text: 'View transaction',
              },
            }),
            'success',
          );

          setTimeout(() => {
            getStakingInfo();
          }, 10000);
        },
        (err: any) => {
          clog(`withdraw err: ${err}`);
          setWithdrawValue(0);
          notify(`Something went wrong! ${errCode(err.code)}`, 'error');
        },
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
