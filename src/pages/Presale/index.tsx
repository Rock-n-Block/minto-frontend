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

  const [presaleInfo, setPresaleInfo] = React.useState({} as IData);

  const [usdtValue, setUsdtValue] = React.useState(0);
  const [btcmtValue, setBtcmtValue] = React.useState(0);
  const [confitmProgress, setConfitmProgress] = React.useState(false);

  const [dataSlider, setDataSlider] = React.useState([
    { accent: '', days: 0, daysName: 'DAYS', percent: 0, active: false },
    { accent: '', days: 31, daysName: 'DAYS', percent: 2, active: false },
    { accent: 'Recommended', days: 90, daysName: 'DAYS', percent: 4, active: true },
    { accent: '', days: 180, daysName: 'DAYS', percent: 8, active: false },
    { accent: '', days: 365, daysName: 'DAYS', percent: 10, active: false },
    { accent: '', days: 730, daysName: 'DAYS', percent: 15, active: false },
  ] as IInfoSliderData[]);

  const [percentValue, setPercentValue] = React.useState(4);

  const { t } = useTranslation();

  // Get Presale Info

  const getPresaleInfo = useCallback(async () => {
    if (!store.is_contractService) store.setContractService();

    setPresaleInfo(await store.contractService.presaleInfo());
  }, [store]);

  // Change amounts ------------------------------------------------

  const handleChangeUsdtAmount = (value: any): void => {
    setUsdtValue(value);
    setBtcmtValue(value * 1.5);

    if (value < 0 || btcmtValue < 0) {
      setUsdtValue(0);
      setBtcmtValue(0);
    }
  };

  const handleChangeBtcmtAmount = (value: any): void => {
    setBtcmtValue(value);
    setUsdtValue(value / 1.5);

    if (value < 0 || usdtValue < 0) {
      setUsdtValue(0);
      setBtcmtValue(0);
    }

    // if (value > +presaleInfo.usdtBalance) setUsdtValue(+presaleInfo.usdtBalance);
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
    handleChangeUsdtAmount(+presaleInfo.usdtBalance);
  };

  // Send Tx ------------------------------------------------

  const handleButtonClaimClick = (): void => {
    if (+usdtValue === 0 && +usdtValue <= 0) {
      notify(`${t('notifications.claim.inputError')}`, 'error');
      return;
    }

    setConfitmProgress(true);

    const amount = deNormalizedValue(usdtValue);

    store.contractService
      .presaleBuy(amount, percentValue)
      .then(
        (data: any) => {
          notify(
            customNotify({
              translate: {
                key: 'notifications.claim.complete',
                data: {
                  token: 'HBTC',
                  value: usdtValue,
                },
              },
              text: `Your Claim ${usdtValue} HBTC complete!`,
              link: {
                url: `${chain.tx.link}/${data[1]}`,
                text: `${t('notifications.claim.link')}`,
              },
            }),
            'success',
          );
          setTimeout(() => {
            getPresaleInfo();
          }, update_after_tx_timeout);
        },
        (err: any) => {
          clogData('buy err: ', err);
          notify(`${t('notifications.error.text')} ${errCode(err.code)}`, 'error');
        },
      )
      .finally(() => {
        setConfitmProgress(false);
        setUsdtValue(0);
        setBtcmtValue(0);
      });
  };

  // On Run ------------------------------------------------

  React.useEffect(() => {
    if (!store.account.address && config.menu.onlyForAuth) {
      store.toggleWalletMenu(true);
    }
    if (!store.account.address) return;
    getPresaleInfo();
  }, [getPresaleInfo, store.account.address, store]);

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
            inputTitle={`You balance: ${presaleInfo.usdtBalance} USDT`}
            btnAllText="All Available"
            btnClick={handleButtonClick}
            submitBtnText="CONFIRM"
            btnProcessed={confitmProgress}
            btnProcessedText={t('button.processing')}
            buttonClick={handleButtonClaimClick}
            inputChange={handleChangeUsdtAmount}
            inputValue={usdtValue}
            getValue={btcmtValue}
            getInputTitle="BTCMT"
            getInputChange={handleChangeBtcmtAmount}
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
