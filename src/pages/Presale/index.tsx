import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js/bignumber.js';
import { observer } from 'mobx-react-lite';

import { PresaleFrom } from '../../components/organisms';
import { IInfoSliderData } from '../../components/organisms/PresaleForm';
import { chain, config, update_after_tx_timeout } from '../../config';
import { useStore } from '../../store';
import { IData } from '../../types';
import { clog, clogData, customNotify, deNormalizedValue, errCode, notify } from '../../utils';
import arrow from '../../assets/img/arrow.png';
import warning from '../../assets/img/warning.png';
import book from '../../assets/img/book.png';

import './Presale.scss';

const Presale: React.FC = () => {
  const store = useStore();
  const { t } = useTranslation();
  const [presaleInfo, setPresaleInfo] = React.useState({} as IData);

  const [usdtValue, setUsdtValue] = React.useState('0');
  const [btcmtValue, setBtcmtValue] = React.useState('0');
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

    const { capToSell, totalSold } = presaleInfo;
    const cap = new BigNumber(capToSell).minus(totalSold);

    if (cap.isLessThanOrEqualTo(0)) {
      info = t('notifications.presale.exedeed');
      setStopSell(true);
    } else if (cap.isLessThanOrEqualTo(200000)) {
      info = `${cap.toFixed(0)} ${t('notifications.presale.left')}`;
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
  }, [presaleInfo, t]);

  // Change amounts ------------------------------------------------
  const handleChangeBtcmtAmount = (value: any): void => {
    const btcmt = new BigNumber(value);
    const usdt = btcmt.multipliedBy(1.5);

    setBtcmtValue(btcmt.toString());
    setUsdtValue(usdt.toString());

    if (btcmt.isLessThan(0) || usdt.isLessThan(0)) {
      setUsdtValue('0');
      setBtcmtValue('0');
    }

    const cap = new BigNumber(presaleInfo.capToSell).minus(presaleInfo.totalSold);

    if (cap.isLessThan(btcmt)) {
      const usdtCap = cap.multipliedBy(1.5);

      setUsdtValue(usdtCap.toString());
      setBtcmtValue(cap.toString());

      notify(`${t('notifications.presale.buy')} ${cap.toString()}`, 'warning');
    }
  };

  const handleChangeUsdtAmount = (value: any): void => {
    const usdt = new BigNumber(value);
    const btcmt = usdt.div(1.5);

    setUsdtValue(usdt.toString());
    setBtcmtValue(btcmt.toString());

    if (usdt.isLessThan(0) || btcmt.isLessThan(0)) {
      setUsdtValue('0');
      setBtcmtValue('0');
    }

    const cap = new BigNumber(presaleInfo.capToSell).minus(presaleInfo.totalSold);

    if (cap.isLessThan(btcmt)) {
      const usdtCap = cap.multipliedBy(1.5);

      setUsdtValue(usdtCap.toString());
      setBtcmtValue(cap.toString());

      notify(`${t('notifications.presale.buy')} ${cap.toString()}`, 'warning');
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
    const cap = new BigNumber(presaleInfo.capToSell).minus(presaleInfo.totalSold);

    if (cap.isLessThan(btcmtValue)) {
      notify(`${t('notifications.presale.buy')} ${cap.toFixed(0)}`, 'warning');
      return;
    }

    if (stopSell) {
      notify(`${t('notifications.presale.exedeed')}`, 'error');
      return;
    }

    if (new BigNumber(usdtValue).isLessThanOrEqualTo(0)) {
      notify(`${t('notifications.presale.inputError')}`, 'error');
      return;
    }

    setConfitmProgress(true);

    const usdt = deNormalizedValue(+usdtValue + 1, true);
    const btcmt = new BigNumber(btcmtValue);

    const btcmDecimals = btcmt.decimalPlaces();

    const deleteAmount =
      btcmDecimals >= 2
        ? (1 / 10 ** btcmDecimals).toFixed(btcmDecimals)
        : btcmDecimals === 1
        ? 0.01
        : 0;

    const btcmtMinus = btcmt.minus(+deleteAmount);
    const btcmtSend = deNormalizedValue(btcmtMinus.toString(), true);

    clog(`btcmt decimals amount: ${btcmDecimals}`);
    clog(`value to minus from btcmt (look on btcmt decimals amount): ${deleteAmount}`);
    clog(`original btcmt (what user input): ${btcmt.toString()}`);
    clog(`${btcmt.toString()} btcmt - ${deleteAmount} amount: ${btcmtMinus.toString()}`);
    clog(`send btcmt: ${btcmtSend}`);

    store.contractService
      .presaleBuy(btcmtSend, usdt, percentValue)
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
        setUsdtValue('0');
        setBtcmtValue('0');

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
            afterBonusText={{
              one: t('page.presale.afterBonusText.one'),
              two: t('page.presale.afterBonusText.two'),
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
            <span className="no_login_data_arrowWrapper">
              <img alt={t('info.connectWallet')} src={arrow} className="no_login_data_arrow" />
            </span>
          </span>

          <div className="no_login_data-attention">
            <img alt={t('info.attention')} src={warning} className="no_login_data-attention-icon" />{t('info.attention')}
          </div>

          <div className="no_login_data-links">
            <a
              href="https://medium.com/@btcmtofficial/a-guide-on-how-to-take-part-in-the-btcmt-presale-99874cf710d3"
              target="_blank"
              rel="nofollow noreferrer"
            >
              <img alt="Info" src={book} className="no_login_data-links-icon" />{t('page.home.links.4')}
            </a>
            <a
              href="https://medium.com/@btcmtofficial/a-detailed-guide-on-staking-42646d817f70"
              target="_blank"
              rel="nofollow noreferrer"
            >
              <img alt="Info" src={book} className="no_login_data-links-icon" />{t('page.home.links.5')}
            </a>
            <a
              href="https://medium.com/@btcmtofficial/how-to-configure-a-metamask-wallet-to-heco-mainnet-39c5d1f3ee23"
              target="_blank"
              rel="nofollow noreferrer"
            >
              <img alt="Info" src={book} className="no_login_data-links-icon" />{t('page.home.links.2')}
            </a>
            <a
              href="https://medium.com/@btcmtofficial/a-detailed-guide-on-staking-42646d817f70"
              target="_blank"
              rel="nofollow noreferrer"
            >
              <img alt="Info" src={book} className="no_login_data-links-icon" />{t('page.home.links.3')}
            </a>
          </div>
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
