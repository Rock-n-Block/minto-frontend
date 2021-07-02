import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import IconLocked from '../../assets/img/icons/lock.svg';
import IconUnlock from '../../assets/img/icons/unlock.svg';
import { Procedure2 } from '../../components/organisms';
import { chain, config, update_after_tx_timeout } from '../../config';
import { useStore } from '../../store';
import { IData } from '../../types';
import {
  clogData,
  customNotify,
  deNormalizedValue,
  errCode,
  getDailyRewards,
  notify,
} from '../../utils';

import './Staking.scss';

const Staking: React.FC = () => {
  const store = useStore();

  const [stakingInfo, setStakingInfo] = React.useState({} as IData);

  const [stLocked, setStLocked] = React.useState(0);
  const [stUnlocked, setStUnlocked] = React.useState(0);

  const [wdLocked, setWdLocked] = React.useState(0);
  const [wdUnlocked, setWdUnlocked] = React.useState(0);

  const [dailyReward, setDailyReward] = React.useState(0);
  const [dailyShared, setDailyShared] = React.useState(0);

  const [balanceOfStaking, setBalanceOfStaking] = React.useState(0);
  // const [dailyRewards, setDailyRewards] = React.useState(0);

  const [stakingProgress, setStakingProgress] = React.useState(false);
  const [withdrawProgress, setWithdrawProgress] = React.useState(false);

  const { t } = useTranslation();

  const getStakingInfo = useCallback(async () => {
    if (!store.is_contractService) store.setContractService();

    await getDailyRewards()
      .then((v: number) => setDailyReward(v))
      .catch((err: any) => clogData('daily reward error:', err));

    const balanceOfSum = await store.contractService.balanceOfSumStaking();
    setBalanceOfStaking(balanceOfSum.value);

    setStakingInfo(await store.contractService.stakingInfo());
  }, [store]);

  // Functions ------------------------------------------------

  // TODO: add daity rewards
  const updateDailyData = (locked: number, unlocked: number) => {
    const amount = +locked + +unlocked;

    const reward = amount === 0 ? 0 : dailyReward / amount;
    const shares = (amount / (amount + balanceOfStaking)) * 100;

    setDailyReward(Number.isNaN(reward) ? 0 : +reward.toFixed(4));
    setDailyShared(Number.isNaN(shares) ? 0 : +shares.toFixed(4));
  };

  // Change amounts ------------------------------------------------

  const handleChangeStakingLockedAmount = (value: number) => {
    setStLocked(value);
    if (value < 0) setStLocked(0);
    if (value > +stakingInfo.availableLocked) setStLocked(+stakingInfo.availableLocked);
    updateDailyData(value, stUnlocked);
  };

  const handleChangeStakingUnlockedAmount = (value: number) => {
    setStUnlocked(value);
    if (value < 0) setStUnlocked(0);
    if (value > +stakingInfo.availableUnlocked) setStUnlocked(+stakingInfo.availableUnlocked);
    updateDailyData(stLocked, value);
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
      notify(`${t('notifications.staking.inputError')}`, 'error');
      return;
    }

    setStakingProgress(true);

    const amount = +stUnlocked === 0 ? 0 : deNormalizedValue(stUnlocked);
    const lAmount = +stLocked === 0 ? 0 : deNormalizedValue(stLocked);

    notify(
      customNotify({
        translate: {
          key: 'notifications.staking.warning',
          data: {
            wdLocked,
            wdUnlocked,
          },
        },
        text: `Attention! You send: ${stLocked} (Locked) and ${stUnlocked} (Unlocked)`,
      }),
      'warning',
    );

    store.contractService
      .startStake(amount, lAmount)
      .then(
        (data: any) => {
          notify(
            customNotify({
              translate: {
                key: 'notifications.staking.complete',
                data: {
                  token: 'BTCMT',
                  stLocked,
                  stUnlocked,
                },
              },
              text: `Your Stake BTCMT ${stLocked} (Locked) and ${stUnlocked} (Unlocked) complete!`,
              link: {
                url: `${chain.tx.link}/${data[1]}`,
                text: `${t('notifications.staking.link')}`,
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
          notify(`${t('notifications.error.text')} ${errCode(err.code)}`, 'error');
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
      notify(`${t('notifications.withdraw.inputError')}`, 'error');
      return;
    }

    const amount = +wdUnlocked === 0 ? 0 : deNormalizedValue(wdUnlocked);
    const lAmount = +wdLocked === 0 ? 0 : deNormalizedValue(wdLocked);

    notify(
      customNotify({
        translate: {
          key: 'notifications.withdraw.warning',
          data: {
            wdLocked,
            wdUnlocked,
          },
        },
        text: `Attention! You send: ${wdLocked} (Locked) and ${wdUnlocked} (Unlocked)`,
      }),
      'warning',
    );

    setWithdrawProgress(true);

    store.contractService
      .withdrawPartially(lAmount, amount)
      .then(
        (data: any) => {
          notify(
            customNotify({
              translate: {
                key: 'notifications.withdraw.complete',
                data: {
                  token: 'BTCMT',
                  wdLocked,
                  wdUnlocked,
                },
              },
              text: `Your Withdraw BTCMT ${wdLocked} (Locked) and ${wdUnlocked} (Unlocked) complete!`,
              link: {
                url: `${chain.tx.link}/${data[1]}`,
                text: `${t('notifications.withdraw.link')}`,
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
          notify(`${t('notifications.error.text')} ${errCode(err.code)}`, 'error');
        },
      )
      .finally(() => {
        setWithdrawProgress(false);
        setWdLocked(0);
        setWdUnlocked(0);
      });
  };

  // On Run ------------------------------------------------

  React.useEffect(() => {
    if (!store.account.address && config.menu.onlyForAuth) store.toggleWalletMenu(true);
    if (!store.account.address) return;
    getStakingInfo();
  }, [getStakingInfo, store.account.address, store]);

  // Template ------------------------------------------------

  return (
    <div className="staking">
      <div className="staking-spacer" />

      {store.account.address ? (
        <div>
          <Procedure2
            title={t('page.staking.component.staking.title')}
            gropupItems={[
              {
                info: [
                  {
                    title: t('page.staking.component.staking.unlocked'),
                    value: `${stakingInfo.availableUnlocked} BTCMT`,
                    src: IconUnlock,
                  },
                  {
                    title: t('page.staking.component.staking.text'),
                    value: `${stakingInfo.userStakesUnlocked} BTCMT`,
                  },
                ],

                inputMiniButtonShow: true,
                inputMiniButtonTitle: t('page.staking.component.staking.buttonText'),
                inputMiniButtonText: t('page.staking.component.staking.button'),
                inputMiniButtonClick: handleFullButtonStakingUnlockedClick,

                inputButtonShow: true,
                inputChange: handleChangeStakingUnlockedAmount,
                inputValue: stUnlocked,
                inputMax: +stakingInfo.availableUnlocked,
              },
              {
                info: [
                  {
                    title: t('page.staking.component.staking.locked'),
                    value: `${stakingInfo.availableLocked} BTCMT`,
                    src: IconLocked,
                  },
                  {
                    title: t('page.staking.component.staking.text'),
                    value: `${stakingInfo.userStakesLocked} BTCMT`,
                  },
                ],
                inputMiniButtonShow: true,
                inputMiniButtonTitle: t('page.staking.component.staking.buttonText'),
                inputMiniButtonText: t('page.staking.component.staking.button'),
                inputMiniButtonClick: handleFullButtonStakingLockedClick,

                inputButtonShow: true,
                inputChange: handleChangeStakingLockedAmount,
                inputValue: stLocked,
                inputMax: +stakingInfo.availableLocked,
              },
            ]}
            submitBtnText={t('page.staking.component.staking.button2')}
            btnProcessed={stakingProgress}
            btnProcessedText={t('button.processing')}
            buttonClick={handleButtonStakingClick}
            daily={{
              dailyReward: `${dailyReward}`,
              dailyRewardTitle: t('page.staking.component.staking.daily.estimatedDailyReward'),
              dailyShare: `${dailyShared}`,
              dailyShareTitle: t('page.staking.component.staking.daily.estimatedDailyShare'),
            }}
          />
          <Procedure2
            title={t('page.staking.component.withdraw.title')}
            theme="light"
            gropupItems={[
              {
                info: [
                  {
                    title: t('page.staking.component.withdraw.unlocked'),
                    value: `${stakingInfo.userStakesUnlocked} BTCMT`,
                  },
                ],

                inputMiniButtonShow: true,
                inputMiniButtonTitle: t('page.staking.component.withdraw.text'),
                inputMiniButtonText: t('page.staking.component.withdraw.button'),
                inputMiniButtonClick: handleFullButtonWithdrawUnlockedClick,

                inputButtonShow: true,
                inputChange: handleChangeWithdrawUnlockedAmount,
                inputValue: wdUnlocked,
                inputMax: +stakingInfo.userStakesUnlocked,
              },
              {
                info: [
                  {
                    title: t('page.staking.component.withdraw.locked'),
                    value: `${stakingInfo.userStakesLocked} BTCMT`,
                  },
                ],

                inputMiniButtonShow: true,
                inputMiniButtonTitle: t('page.staking.component.withdraw.text'),
                inputMiniButtonText: t('page.staking.component.withdraw.button'),
                inputMiniButtonClick: handleFullButtonWithdrawLockedClick,

                inputButtonShow: true,
                inputChange: handleChangeWithdrawLockedAmount,
                inputValue: wdLocked,
                inputMax: +stakingInfo.userStakesLocked,
              },
            ]}
            submitBtnText={t('page.staking.component.withdraw.button2')}
            btnProcessed={withdrawProgress}
            btnProcessedText={t('button.processing')}
            buttonClick={handleButtonWithdrawClick}
          />
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default observer(Staking);
