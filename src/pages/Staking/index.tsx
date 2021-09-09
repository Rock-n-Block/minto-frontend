// import React from 'react';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js/bignumber.js';
import { observer } from 'mobx-react-lite';

import IconLocked from '../../assets/img/icons/lock.svg';
import IconUnlock from '../../assets/img/icons/unlock.svg';
import { Procedure2 } from '../../components/organisms';
import { chain, config, update_after_tx_timeout } from '../../config';
import { useStore } from '../../store';
import { IData } from '../../types';
import {
  clog,
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

  const [stLocked, setStLocked] = React.useState('0');
  const [stUnlocked, setStUnlocked] = React.useState('0');

  const [wdLocked, setWdLocked] = React.useState('0');
  const [wdUnlocked, setWdUnlocked] = React.useState('0');

  const [dailyReward, setDailyReward] = React.useState('0');
  const [dailyShared, setDailyShared] = React.useState('0');

  const [balanceOfStaking, setBalanceOfStaking] = React.useState('0');

  const [stakingProgress, setStakingProgress] = React.useState(false);
  const [withdrawProgress, setWithdrawProgress] = React.useState(false);

  const { t } = useTranslation();

  const getStakingInfo = useCallback(async () => {
    if (!store.is_contractService) store.setContractService();

    await getDailyRewards()
      .then((v: number) => setDailyReward(new BigNumber(v).toString()))
      .catch((err: any) => clogData('daily reward error:', err));

    const balanceOfSum = await store.contractService.balanceOfSumStaking();
    setBalanceOfStaking(new BigNumber(balanceOfSum.value).toString());

    setStakingInfo(await store.contractService.stakingInfo());
  }, [store]);

  // Functions ------------------------------------------------

  const updateDailyData = (locked: string, unlocked: string) => {
    const amount = new BigNumber(locked).plus(unlocked);

    const reward = amount.isEqualTo(0) ? new BigNumber(0) : new BigNumber(dailyReward).div(amount);
    const shares = amount.div(amount.plus(balanceOfStaking)).multipliedBy(100);

    setDailyReward(reward.isNaN() ? '0' : reward.toString());
    setDailyShared(shares.isNaN() ? '0' : shares.toString());
  };

  // Change amounts ------------------------------------------------

  const handleChangeStakingLockedAmount = (value: number) => {
    const { availableLocked } = stakingInfo;
    const amountAvailable = new BigNumber(availableLocked);
    const amount = new BigNumber(value);

    setStLocked(amount.toString());
    if (amount.isLessThan(0)) setStLocked('0');
    if (amount.isGreaterThan(amountAvailable)) setStLocked(amountAvailable.toString());
    updateDailyData(amount.toString(), stUnlocked);
  };

  const handleChangeStakingUnlockedAmount = (value: number) => {
    const { availableUnlocked } = stakingInfo;
    const amountAvailable = new BigNumber(availableUnlocked);
    const amount = new BigNumber(value);

    setStUnlocked(amount.toString());
    if (amount.isLessThan(0)) setStUnlocked('0');
    if (amount.isGreaterThan(amountAvailable)) setStUnlocked(amountAvailable.toString());

    updateDailyData(stLocked, amount.toString());
  };

  const handleChangeWithdrawLockedAmount = (value: number) => {
    const { userStakesLocked } = stakingInfo;
    const amountAvailable = new BigNumber(userStakesLocked);
    const amount = new BigNumber(value);

    setWdLocked(amount.toString());
    if (amount.isLessThan(0)) setWdLocked('0');
    if (amount.isGreaterThan(amountAvailable)) setWdLocked(amountAvailable.toString());
  };

  const handleChangeWithdrawUnlockedAmount = (value: number) => {
    const { userStakesUnlocked } = stakingInfo;
    const amountAvailable = new BigNumber(userStakesUnlocked);
    const amount = new BigNumber(value);

    setWdUnlocked(amount.toString());
    if (amount.isLessThan(0)) setWdUnlocked('0');
    if (amount.isGreaterThan(amountAvailable)) setWdUnlocked(amountAvailable.toString());
  };

  // Send Max ------------------------------------------------

  const handleFullButtonStakingLockedClick = () => {
    setStLocked(stakingInfo.availableLocked as string);
  };

  const handleFullButtonStakingUnlockedClick = () => {
    setStUnlocked(stakingInfo.availableUnlocked as string);
  };

  const handleFullButtonWithdrawLockedClick = () => {
    setWdLocked(stakingInfo.userStakesLocked as string);
  };

  const handleFullButtonWithdrawUnlockedClick = () => {
    setWdUnlocked(stakingInfo.userStakesUnlocked as string);
  };

  // Send Tx ------------------------------------------------

  const handleButtonStakingClick = () => {
    if (+stLocked === 0 && +stLocked <= 0 && +stUnlocked === 0 && +stUnlocked <= 0) {
      notify(`${t('notifications.staking.inputError')}`, 'error');
      return;
    }

    setStakingProgress(true);

    const unlocked = +stUnlocked === 0 ? '0' : deNormalizedValue(stUnlocked, true);
    const locked = +stLocked === 0 ? '0' : deNormalizedValue(stLocked, true);

    // console.log('ss', ss);

    // const unlocked = new BigNumber(stUnlocked);
    // const locked = new BigNumber(stLocked);
    // const unlocked = deNormalizedValue(stUnlocked);
    // const unlocked = '1.111e+21';
    // const unlocked = new BigNumber('1111').times(10**21);

    // const nUnlocked = new BigNumber(stUnlocked);
    // let btcmtFix = stUnlocked;

    // if (nUnlocked.decimalPlaces() > 18) {
    //   const vToDelete = nUnlocked.decimalPlaces() - 18;
    //   console.log(nUnlocked.decimalPlaces(), vToDelete);
    //   btcmtFix = btcmtFix.substring(0, btcmtFix.length - vToDelete);
    // }
    // // console.log('btcmt slicce', btcmt.toString(), btcmtFix);

    // const btcmtToMinus = new BigNumber(
    //   nUnlocked.decimalPlaces() > 18 ? btcmtFix : nUnlocked,
    // ).toString();

    // const btcmDecimals = btcmtToMinus.decimalPlaces();

    // const mUnlocked = stUnlocked.split('.');

    // console.log('sadasdasdas', btcmtToMinus, stUnlocked);
    // const mUnlocked = btcmtToMinus.split('.');
    // const decimals = 18;
    // console.log(mUnlocked);

    // const mUnlockedDecimals = mUnlocked[1].length;
    // const nDecimals = decimals - mUnlockedDecimals;

    // console.log('nDecimals', nDecimals);

    // // const unlocked = mUnlocked[0] + mUnlocked[1] + (10 ** (nDecimals - 1)).toString();
    // const unlocked = mUnlocked[0] + (Number(mUnlocked[1]) * 10 ** nDecimals).toString();
    // .startStake(deNormalizedValue(unlocked.toString()), deNormalizedValue(locked.toString()))

    clog(`staking unlocked: ${unlocked}, locked: ${locked}`);
    store.contractService
      .startStake(unlocked, locked)
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
        setStLocked('0');
        setStUnlocked('0');
      });
  };

  const handleButtonWithdrawClick = () => {
    if (+wdLocked === 0 && +wdLocked <= 0 && +wdUnlocked === 0 && +wdUnlocked <= 0) {
      notify(`${t('notifications.withdraw.inputError')}`, 'error');
      return;
    }

    const unlocked = +wdUnlocked === 0 ? 0 : deNormalizedValue(wdUnlocked, true);
    const locked = +wdLocked === 0 ? 0 : deNormalizedValue(wdLocked, true);

    setWithdrawProgress(true);

    clog(`withdraw unlocked: ${unlocked}, locked: ${locked}`);

    store.contractService
      .withdrawPartially(locked, unlocked)
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
        setWdLocked('0');
        setWdUnlocked('0');
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
      {/* <div className="no_login_data">
        <span className="links__title text-center text text-black text-bold-e">
          {t('info.inDev')}
        </span>
      </div> */}
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
          <div className="staking_withdraw-info">
            <span>{t('page.staking.component.withdraw.attention')}</span>
          </div>
        </div>
      ) : (
        <div className="no_login_data">
          <span className="links__title text-center text text-black text-bold-e">
            {t('info.connectWallet')}
          </span>
        </div>
      )}
    </div>
  );
};

export default observer(Staking);
