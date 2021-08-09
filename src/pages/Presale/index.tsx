import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { PresaleFrom } from '../../components/organisms';
import { IInfoSliderData } from '../../components/organisms/PresaleForm';
import { chain, config, update_after_tx_timeout } from '../../config';
import { useStore } from '../../store';
import { IData } from '../../types';
import { clogData, customNotify, deNormalizedValue, errCode, notify } from '../../utils';

import './Presale.scss';

const Presale: React.FC = () => {
  const store = useStore();

  const [miningInfo, setMiningInfo] = React.useState({} as IData);

  const [mnValue, setMnValue] = React.useState(0);
  const [miningProgress, setMiningProgress] = React.useState(false);

  const [dataSlider, setDataSlider] = React.useState([
    { accent: '', days: 0, daysName: 'DAYS', percent: 0, active: false },
    { accent: '', days: 31, daysName: 'DAYS', percent: 2, active: false },
    { accent: 'Recommended', days: 90, daysName: 'DAYS', percent: 4, active: true },
    { accent: '', days: 180, daysName: 'DAYS', percent: 8, active: false },
    { accent: '', days: 365, daysName: 'DAYS', percent: 10, active: false },
    { accent: '', days: 730, daysName: 'DAYS', percent: 15, active: false },
  ] as IInfoSliderData[]);

  const [percentValue, setPercentValue] = React.useState(0);

  const { t } = useTranslation();

  const getMiningInfo = useCallback(async () => {
    if (!store.is_contractService) store.setContractService();

    setMiningInfo(await store.contractService.miningInfo());
  }, [store]);

  // Change amounts ------------------------------------------------

  const handleChangeClaimAmount = (value: any): void => {
    setMnValue(value);
    if (value < 0) setMnValue(0);
    if (value > +miningInfo.availableToClaim) setMnValue(+miningInfo.availableToClaim);
  };

  const handleSliderClick = (value: any): void => {
    if (percentValue === value) return;

    const dataSliderCopy = dataSlider;

    dataSliderCopy.map((i) => {
      i.active = i.percent === value;
      return i;
    });

    setPercentValue(value);
    setDataSlider(dataSliderCopy);
  };

  // Send Max ------------------------------------------------

  const handleButtonClick = (): void => {
    setMnValue(+miningInfo.availableToClaim);
  };

  // Send Tx ------------------------------------------------

  const handleButtonClaimClick = (): void => {
    if (+mnValue === 0 && +mnValue <= 0) {
      notify(`${t('notifications.claim.inputError')}`, 'error');
      return;
    }

    setMiningProgress(true);
    if (mnValue === +miningInfo.availableToClaim) {
      store.contractService
        .claimAllReward()
        .then(
          (data: any) => {
            notify(
              customNotify({
                translate: {
                  key: 'notifications.claim.complete',
                  data: {
                    token: 'HBTC',
                    value: +miningInfo.availableToClaim,
                  },
                },
                text: `Your Claim ${+miningInfo.availableToClaim} HBTC complete!`,
                link: {
                  url: `${chain.tx.link}/${data[1]}`,
                  text: `${t('notifications.claim.link')}`,
                },
              }),
              'success',
            );

            setTimeout(() => {
              getMiningInfo();
            }, update_after_tx_timeout);
          },
          (err: any) => clogData('claim err: ', err),
        )
        .finally(() => {
          setMiningProgress(false);
          setMnValue(0);
        });

      return;
    }

    const amount = deNormalizedValue(mnValue);

    store.contractService
      .claimReward(amount)
      .then(
        (data: any) => {
          notify(
            customNotify({
              translate: {
                key: 'notifications.claim.complete',
                data: {
                  token: 'HBTC',
                  value: mnValue,
                },
              },
              text: `Your Claim ${mnValue} HBTC complete!`,
              link: {
                url: `${chain.tx.link}/${data[1]}`,
                text: `${t('notifications.claim.link')}`,
              },
            }),
            'success',
          );
          setTimeout(() => {
            getMiningInfo();
          }, update_after_tx_timeout);
        },
        (err: any) => {
          clogData('claim err: ', err);
          notify(`${t('notifications.error.text')} ${errCode(err.code)}`, 'error');
        },
      )
      .finally(() => {
        setMiningProgress(false);
        setMnValue(0);
      });
  };

  // On Run ------------------------------------------------

  React.useEffect(() => {
    if (!store.account.address && config.menu.onlyForAuth) {
      store.toggleWalletMenu(true);
    }
    if (!store.account.address) return;
    getMiningInfo();
  }, [getMiningInfo, store.account.address, store]);

  // Template ------------------------------------------------

  return (
    <div className="presale">
      {store.account.address ? (
        <div>
          <PresaleFrom
            title={{
              one: 'BTCMT',
              two: 'PRESALE',
            }}
            slider={{
              data: dataSlider,
              onСlick: handleSliderClick,
            }}
            info={[
              {
                title: t('page.mining.text.left'),
                value: `${miningInfo.th} TH/s`,
              },
              {
                title: t('page.mining.text.right'),
                value: `${miningInfo.availableToClaim} HBTC`,
              },
            ]}
            ratio={{
              title: 'Ratio',
              first: {
                title: 'BTCMT',
                value: '1',
              },
              second: {
                title: 'USDT',
                value: '1.5',
              },
            }}
            infoText="[number] BTCMT left for presale"
            miniButtonShow
            inputTitle={`You balance: ${213} USDT`}
            btnAllText="All Available"
            btnClick={handleButtonClick}
            submitBtnText="CONFIRM"
            btnProcessed={miningProgress}
            btnProcessedText={t('button.processing')}
            buttonClick={handleButtonClaimClick}
            inputChange={handleChangeClaimAmount}
            inputValue={mnValue}
            getValue="231"
            getInputTitle="BTCMT"
          />
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

export default observer(Presale);
