import React from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { autorun } from 'mobx';

import { Procedure } from '../../components/organisms';
import { StakingInfo } from '../../components/sections';
import { config, contracts, update_after_tx_timeout } from '../../config';
import { useStore } from '../../store';
import { IData } from '../../types';
import { clogData, customNotify, errCode, notify } from '../../utils';

import './Staking.scss';

const Staking: React.FC = () => {
  const store = useStore();

  const [stakingInfo, setStakingInfo] = React.useState({} as IData);
  const [firstStart, setFirstStart] = React.useState(true);
  const [stakingValue, setStakingValue] = React.useState(0);
  const [withdrawValue, setWithdrawValue] = React.useState(0);
  const [stakingProgress, setStakingProgress] = React.useState(false);
  const [withdrawProgress, setWithdrawProgress] = React.useState(false);

  const getStakingInfo = async () => {
    setFirstStart(false);

    if (!store.is_contractService) store.setContractService();
    store.setDecimals(new BigNumber(10).pow(contracts.decimals).toString());

    setStakingInfo(await store.contractService.stakingInfo());
  };

  const handleChangeStakingAmount = (value: any) => {
    setStakingValue(value);
    if (value < 0) setStakingValue(0);
    if (value > +stakingInfo.balanceOf) setStakingValue(+stakingInfo.balanceOf);
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

  const handleButtonStakingClick = () => {
    if (+stakingValue === 0 || +stakingValue <= 0) {
      notify('Please, input value in staking field.', 'warning');
      return;
    }

    setStakingProgress(true);
    const amount = new BigNumber(stakingValue).multipliedBy(store.decimals).toString();

    store.contractService
      .startStake(amount, '0')
      .then(
        (data: any) => {
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
          }, update_after_tx_timeout);
        },
        (err: any) => {
          clogData('staking error: ', err);
          notify(`Something went wrong! ${errCode(err.code)}`, 'error');
        },
      )
      .finally(() => {
        setStakingProgress(false);
        setStakingValue(0);
      });
  };

  const handleButtonWithdrawClick = () => {
    notify('Please wait, withdraw is in progress.', 'info');
    setWithdrawProgress(true);
    store.contractService
      .withdrow()
      .then(
        (data: any) => {
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
          }, update_after_tx_timeout);
        },
        (err: any) => {
          clogData('withdraw error: ', err);
          notify(`Something went wrong! ${errCode(err.code)}`, 'error');
        },
      )
      .finally(() => {
        setWithdrawProgress(false);
        setWithdrawValue(0);
      });
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

  return (
    <div className="staking">
      {store.account.address ? (
        <StakingInfo info={stakingInfo} token="BTCMT" />
      ) : (
        <div className="no_login_data">
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
