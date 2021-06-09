import React from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { autorun } from 'mobx';

import IconLocked from '../../assets/img/icons/lock.svg';
import IconUnlock from '../../assets/img/icons/unlock.svg';
import { Procedure2 } from '../../components/organisms';
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

  const [stLocked, setStLocked] = React.useState(0);
  const [stUnlocked, setStUnlocked] = React.useState(0);

  const [wdLocked, setWdLocked] = React.useState(0);
  const [wdUnlocked, setWdUnlocked] = React.useState(0);

  const [stakingProgress, setStakingProgress] = React.useState(false);
  const [withdrawProgress, setWithdrawProgress] = React.useState(false);

  const getStakingInfo = async () => {
    setFirstStart(false);

    if (!store.is_contractService) store.setContractService();
    store.setDecimals(new BigNumber(10).pow(contracts.decimals).toString());

    setStakingInfo(await store.contractService.stakingInfo());
  };

  // Change amounts ------------------------------------------------

  const handleChangeStakingLockedAmount = (value: number) => {
    setStLocked(value);
    if (value < 0) setStLocked(0);
    if (value > +stakingInfo.availableLocked) setStLocked(+stakingInfo.availableLocked);
  };

  const handleChangeStakingUnlockedAmount = (value: number) => {
    setStUnlocked(value);
    if (value < 0) setStUnlocked(0);
    if (value > +stakingInfo.availableUnlocked) setStUnlocked(+stakingInfo.availableUnlocked);
  };

  const handleChangeWithdrawLockedAmount = (value: number) => {
    setWdLocked(value);
    if (value < 0) setWdLocked(0);
    if (value > +stakingInfo.userStakesLocked) setWdLocked(+stakingInfo.userStakesLocked);
  };

  const handleChangeWithdrawUnlockedAmount = (value: number) => {
    setWdUnlocked(value);
    if (value < 0) setWdUnlocked(0);
    if (value > +stakingInfo.userStakesUnlocked) setWdUnlocked(+stakingInfo.userStakesUnlocked);
  };

  // Send Max ------------------------------------------------

  const handleFullButtonStakingLockedClick = () => {
    setStLocked(+stakingInfo.availableLocked);
  };

  const handleFullButtonStakingUnlockedClick = () => {
    setStUnlocked(+stakingInfo.availableUnlocked);
  };

  const handleFullButtonWithdrawLockedClick = () => {
    setWdLocked(+stakingInfo.userStakesLocked);
  };

  const handleFullButtonWithdrawUnlockedClick = () => {
    setWdUnlocked(+stakingInfo.userStakesUnlocked);
  };

  // Send Tx ------------------------------------------------

  const handleButtonStakingClick = () => {
    if (+stLocked === 0 && +stLocked <= 0 && +stUnlocked === 0 && +stUnlocked <= 0) {
      notify('Please, input value in staking fields (both or one).', 'error');
      return;
    }

    setStakingProgress(true);

    const amount = new BigNumber(stUnlocked).multipliedBy(store.decimals).toString();
    const lamount =
      +stLocked === 0 ? 0 : new BigNumber(stLocked).multipliedBy(store.decimals).toString();

    notify(`Attention! You send: ${stLocked} (Locked) and ${stUnlocked} (Unlocked)`, 'warning');

    store.contractService
      .startStake(amount, lamount)
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
        setStLocked(0);
        setStUnlocked(0);
      });
  };

  const handleButtonWithdrawClick = () => {
    if (+wdLocked === 0 && +wdLocked <= 0 && +wdUnlocked === 0 && +wdUnlocked <= 0) {
      notify('Please, input value in withdraw fields (both or one).', 'error');
      return;
    }

    notify(`Attention! You send: ${wdLocked} (Locked) and ${wdUnlocked} (Unlocked)`, 'warning');

    setWithdrawProgress(true);

    store.contractService
      .withdraw()
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
        setWdLocked(0);
        setWdUnlocked(0);
      });
  };

  // On Run ------------------------------------------------

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

  // Template ------------------------------------------------

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
          <Procedure2
            title="Stake your tokens"
            gropupItems={[
              {
                info: [
                  {
                    title: 'Unlocked',
                    value: `${stakingInfo.availableUnlocked} BTCMT`,
                    src: IconUnlock,
                  },
                  {
                    title: 'You already staked',
                    value: `${stakingInfo.userStakesUnlocked} BTCMT`,
                  },
                ],

                inputMiniButtonShow: true,
                inputMiniButtonTitle: 'Amount to stake',
                inputMiniButtonText: 'All available',
                inputMiniButtonClick: handleFullButtonStakingUnlockedClick,

                inputButtonShow: true,
                inputChange: handleChangeStakingUnlockedAmount,
                inputValue: stUnlocked,
                inputMax: +stakingInfo.availableUnlocked,
              },
              {
                info: [
                  {
                    title: 'Locked BTCMT',
                    value: `${stakingInfo.availableLocked} BTCMT`,
                    src: IconLocked,
                  },
                  {
                    title: 'You already staked',
                    value: `${stakingInfo.userStakesLocked} BTCMT`,
                  },
                ],
                inputMiniButtonShow: true,
                inputMiniButtonTitle: 'Amount to stake',
                inputMiniButtonText: 'All available',
                inputMiniButtonClick: handleFullButtonStakingLockedClick,

                inputButtonShow: true,
                inputChange: handleChangeStakingLockedAmount,
                inputValue: stLocked,
                inputMax: +stakingInfo.availableLocked,
              },
            ]}
            submitBtnText="Stake"
            btnProcessed={stakingProgress}
            btnProcessedText="Processing..."
            buttonClick={handleButtonStakingClick}
          />
          <Procedure2
            title="Withdraw"
            theme="light"
            gropupItems={[
              {
                info: [
                  // {
                  //   title: 'Unlocked',
                  //   value: `${stakingInfo.userStakes} BTCMT`,
                  //   src: IconUnlock,
                  // },
                  {
                    title: 'Unlocked Amount to withdraw',
                    value: `${stakingInfo.userStakesUnlocked} BTCMT`,
                  },
                ],

                inputMiniButtonShow: true,
                inputMiniButtonTitle: 'Amount to withdraw',
                inputMiniButtonText: 'All available',
                inputMiniButtonClick: handleFullButtonWithdrawUnlockedClick,

                inputButtonShow: true,
                inputChange: handleChangeWithdrawUnlockedAmount,
                inputValue: wdUnlocked,
                inputMax: +stakingInfo.userStakesUnlocked,
              },
              {
                info: [
                  // {
                  //   title: 'Locked BTCMT',
                  //   value: `${stakingInfo.userStakes} BTCMT`,
                  //   src: IconLocked,
                  // },
                  {
                    title: 'Locked Amount to withdraw',
                    value: `${stakingInfo.userStakesLocked} BTCMT`,
                  },
                ],

                inputMiniButtonShow: true,
                inputMiniButtonTitle: 'Amount to withdraw',
                inputMiniButtonText: 'All available',
                inputMiniButtonClick: handleFullButtonWithdrawLockedClick,

                inputButtonShow: true,
                inputChange: handleChangeWithdrawLockedAmount,
                inputValue: wdLocked,
                inputMax: +stakingInfo.userStakesLocked,
              },
            ]}
            submitBtnText="Withdraw"
            btnProcessed={withdrawProgress}
            btnProcessedText="Processing..."
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
