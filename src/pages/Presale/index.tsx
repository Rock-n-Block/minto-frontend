import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { PresaleFrom } from '../../components/organisms';
import { IInfoSliderData } from '../../components/organisms/PresaleForm';
import { chain, config, update_after_tx_timeout } from '../../config';
import { useStore } from '../../store';
import { IData } from '../../types';
import { clog, clogData, customNotify, deNormalizedValue, errCode, notify } from '../../utils';

import './Presale.scss';

const Presale: React.FC = () => {
  const store = useStore();
  const { t } = useTranslation();
  const [presaleInfo, setPresaleInfo] = React.useState({} as IData);

  const [usdtValue, setUsdtValue] = React.useState(0);
  const [btcmtValue, setBtcmtValue] = React.useState(0);
  const [confitmProgress, setConfitmProgress] = React.useState(false);
  const [infoText, setInfoText] = React.useState('');
  const [stopSell, setStopSell] = React.useState(false);
  const [modal, setModal] = React.useState(false);

  const [dataSlider, setDataSlider] = React.useState([] as IInfoSliderData[]);

  const [percentValue, setPercentValue] = React.useState(4);

  // Get Presale Info
  const getPresaleInfo = useCallback(async () => {
    if (!store.is_contractService) store.setContractService();

    setPresaleInfo(await store.contractService.presaleInfo());
  }, [store]);

  const checkSpendCap = useCallback(() => {
    let info = '';
    const cap = +presaleInfo.capToSell - +presaleInfo.totalSold;

    clog(
      `capToSell: ${presaleInfo.capToSell}, totalSold: ${presaleInfo.totalSold}, capToSell-totalSold: ${cap}`,
    );

    if (cap <= 0) {
      info = t('notifications.presale.exedeed');
      setStopSell(true);
    } else if (cap <= 200000) {
      info = `${cap} ${t('notifications.presale.left')}`;
    }

    setInfoText(info);
    setDataSlider([
      { accent: '', days: 0, daysName: `${t('page.presale.days')}`, percent: 0, active: false },
      { accent: '', days: 31, daysName: `${t('page.presale.days')}`, percent: 2, active: false },
      {
        accent: t('page.presale.recommended'),
        days: 90,
        daysName: t('page.presale.days'),
        percent: 4,
        active: true,
      },
      { accent: '', days: 180, daysName: `${t('page.presale.days')}`, percent: 8, active: false },
      { accent: '', days: 365, daysName: t('page.presale.days'), percent: 10, active: false },
      { accent: '', days: 730, daysName: `${t('page.presale.days')}`, percent: 15, active: false },
    ]);
  }, [presaleInfo.capToSell, presaleInfo.totalSold, t]);

  // Change amounts ------------------------------------------------
  const handleChangeBtcmtAmount = (value: any): void => {
    setBtcmtValue(value);
    setUsdtValue(value * 1.5);

    if (+value < 0 || +usdtValue < 0) {
      setUsdtValue(0);
      setBtcmtValue(0);
    }

    const cap = +presaleInfo.capToSell - +presaleInfo.totalSold;

    if (+value > cap) {
      const usdt = cap * 1.5;

      setUsdtValue(usdt);
      setBtcmtValue(cap);

      notify(`You can't buy BTCMT more than ${cap}`, 'warning');
    }
  };

  const handleChangeUsdtAmount = (value: any): void => {
    setUsdtValue(value);
    setBtcmtValue(value / 1.5);

    if (value < 0 || btcmtValue < 0) {
      setUsdtValue(0);
      setBtcmtValue(0);
    }

    const cap = +presaleInfo.capToSell - +presaleInfo.totalSold;

    if (+(value / 1.5) > cap) {
      const usdt = cap * 1.5;

      setUsdtValue(usdt);
      setBtcmtValue(cap);

      notify(`You can't buy BTCMT more than ${cap}`, 'warning');
    }
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
    const cap = +presaleInfo.capToSell - +presaleInfo.totalSold;

    if (btcmtValue > cap) {
      notify(`You can't buy BTCMT more than ${cap}`, 'warning');
      return;
    }

    if (stopSell) {
      notify(`${t('notifications.presale.exedeed')}`, 'error');
      return;
    }

    if (+usdtValue === 0 && +usdtValue <= 0) {
      notify(`${t('notifications.presale.inputError')}`, 'error');
      return;
    }

    setConfitmProgress(true);

    const usdt = deNormalizedValue(+usdtValue + 1);
    const btcmt = deNormalizedValue(btcmtValue);

    store.contractService
      .presaleBuy(btcmt, usdt, percentValue)
      .then(
        (data: any) => {
          notify(
            customNotify({
              translate: {
                key: 'notifications.presale.complete',
                data: {
                  token: 'BTCMT',
                  value: btcmtValue,
                },
              },
              text: `Your Presale ${btcmtValue} BTCMT complete!`,
              link: {
                url: `${chain.tx.link}/${data[1]}`,
                text: `${t('notifications.presale.link')}`,
              },
            }),
            'success',
          );
          setModal(true);
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

        setTimeout(() => {
          getPresaleInfo();
        }, update_after_tx_timeout);
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

  React.useEffect(() => {
    checkSpendCap();
  }, [checkSpendCap, presaleInfo]);

  // Template ------------------------------------------------

  return (
    <div className="presale">
      {store.account.address ? (
        <div>
          <PresaleFrom
            title={{
              one: 'BTCMT',
              two: `${t('page.presale.title')}`,
            }}
            slider={{
              data: dataSlider,
              onСlick: handleSliderClick,
            }}
            ratio={{
              title: `${t('page.presale.ratio')}`,
              first: {
                title: 'BTCMT',
                value: '1',
              },
              second: {
                title: 'USDT',
                value: '1.5',
              },
            }}
            underHoldText={{
              one: t('page.presale.underHoldText.one'),
              two: t('page.presale.underHoldText.two'),
            }}
            infoText={infoText}
            miniButtonShow
            inputTitle={`${t('page.presale.balance')}: ${presaleInfo.usdtBalance} USDT`}
            btnAllText={t('page.presale.allAvailable')}
            btnClick={handleButtonClick}
            submitBtnText={t('page.presale.btnConfirm')}
            btnProcessed={confitmProgress}
            btnProcessedText={t('button.processing')}
            buttonClick={handleButtonClaimClick}
            inputChange={handleChangeUsdtAmount}
            inputValue={usdtValue}
            getValue={btcmtValue}
            getInputTitle="BTCMT"
            getInputChange={handleChangeBtcmtAmount}
            percentBonus={percentValue}
            bonusText={t('page.presale.bonusText')}
            holdTime={t('page.presale.holdTime')}
            amountText={t('page.presale.amount')}
            youGetText={t('page.presale.youGetText')}
            withBonusText={t('page.presale.withBonusText')}
            stopSell={stopSell}
            soldOutText={t('page.presale.soldOutText')}
          />
        </div>
      ) : (
        <div className="no_login_data">
          <span className="links__title text-center text text-black text-bold-e">
            {t('info.connectWallet')}
          </span>
        </div>
      )}

      {modal ? (
        <div className="modal">
          <div className="modal-wrap">
            <span
              className="modal-close"
              role="button"
              tabIndex={0}
              onKeyDown={() => setModal(false)}
              onClick={() => setModal(false)}
            >
              x
            </span>
            <div className="modal-title">{t('page.presale.modal.title')}</div>
            <div className="modal-text">{t('page.presale.modal.text')}</div>
            <div
              className="modal-btn"
              role="button"
              tabIndex={0}
              onKeyDown={() => setModal(false)}
              onClick={() => setModal(false)}
            >
              {t('page.presale.modal.btn')}
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default observer(Presale);
