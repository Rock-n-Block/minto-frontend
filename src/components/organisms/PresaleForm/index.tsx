import React from 'react';
import { useTranslation } from 'react-i18next';
import nextId from 'react-id-generator';
import { Modal } from 'antd';
import cn from 'classnames';

import CheckIcon from '../../../assets/img/icons/check-icon.svg';
import { Button, Input } from '../../atoms';

import './Presale.scss';

export interface IInfoSliderData {
  accent: string;
  days: number;
  daysName: string;
  percent: number;
  active: boolean;
}

interface IInfoSlider {
  data: IInfoSliderData[];
  onСlick: (e: any) => void;
}

interface IProcedure {
  slider: IInfoSlider;
  theme?: 'light' | 'dark';
  title: {
    one: string;
    two: string;
  };
  ratio: {
    title: string;
    first: {
      title: string;
      value: string;
    };
    second: {
      title: string;
      value: string;
    };
  };
  infoText?: string;
  inputTitle: string;
  btnAllText: string;
  submitBtnText: string;
  inputType?: string;
  inputChange?: any;
  getInputChange?: any;
  buttonClick?: any;
  inputValue?: any;
  btnClick?: any;
  miniButtonShow?: boolean;
  inputButtonShow?: boolean;
  btnProcessed?: boolean;
  btnProcessedText?: string;
  // inputMax?: number;
  getValue: any;
  getInputTitle: string;
  soldOutText: string;
  percentBonus: number;
  stopSell: boolean;
  holdTime: string;
  bonusText: string;
  amountText: string;
  youGetText: string;
  withBonusText: string;
  underHoldText: {
    one: string;
    two: string;
  };
  afterBonusText: {
    one: string;
    two: string;
  };
}

const Procedure: React.FC<IProcedure> = ({
  slider,
  theme = 'dark',
  title,
  ratio,
  inputTitle,
  btnAllText,
  submitBtnText,
  infoText,
  inputType,
  inputChange,
  buttonClick,
  inputValue,
  btnClick,
  miniButtonShow,
  inputButtonShow = true,
  btnProcessed = false,
  btnProcessedText = 'Please Wait...',
  getValue,
  getInputTitle,
  getInputChange,
  percentBonus,
  stopSell,
  soldOutText,
  holdTime,
  bonusText,
  amountText,
  youGetText,
  withBonusText,
  underHoldText,
  afterBonusText,
}) => {
  const [showModal, setShowModal] = React.useState(false);
  const [infoModal, setInfoModal] = React.useState('');

  const { t } = useTranslation();

  function ModalInfo(props: { name: string }) {
    const { name } = props;

    if (name === 'add') {
      return (
        <div>
          <br />
          <span className="procedure__modal-title">{t('page.presale.modaTitle.1')}</span>
          <br />
          <b>Pay for the tokens</b>
          <p>
            Payment is made through the MetaMask wallet. Gas is paid in HT. Tokens are bought for
            USDT (HECO).
          </p>
          <br />
          <b>Add tokens to MetaMask — click “Add Token” in the application or browser extension.</b>
          <br />
          <br />
          <p>To add tokens, you should enter the addresses of their smart contracts.</p>
          <br />
          <b>Smart contract address USDT (HECO):</b>{' '}
          <pre>0xa71edc38d189767582c38a3145b5873052c3e47a</pre>
          <br />
          <b>Smart contract address BTCMT (HECO):</b>{' '}
          <pre>0x410a56541bD912F9B60943fcB344f1E3D6F09567</pre>
          <br />
          Once the tokens are added, your wallet will display them. Now you need to buy them.
        </div>
      );
    }

    if (name === 'set') {
      return (
        <div>
          <br />
          <span className="procedure__modal-title">{t('page.presale.modaTitle.2')}</span>
          <br />
          You will have to set up your wallet to Heco Mainnet to work with Minto. <br />
          By default, the MetaMask wallet is configured on the Ethereum network. <br />
          Go to “Settings” on your MetaMask and click “Networks”:
          <br />
          <br />
          <p>Enter the data of the new network Heco Mainnet in a window that opens:</p>
          <br />
          Network Name: Heco <br />
          RPC URL:{' '}
          <a href="https://http-mainnet.hecochain.com" target="_blank" rel="noreferrer">
            https://http-mainnet.hecochain.com
          </a>{' '}
          <a href="https://scan.hecochain.com" target="_blank" rel="noreferrer">
            https://scan.hecochain.com
          </a>{' '}
          <br />
          ChainID: 128 <br /> Symbol: HT <br />
          Block Explorer:{' '}
          <a href="https://hecoinfo.com/ " target="_blank" rel="noreferrer">
            https://hecoinfo.com/{' '}
          </a>{' '}
          <br />
          <br />
          Then you can see that your wallet is switched to Heco.
        </div>
      );
    }

    if (name === 'buy') {
      return (
        <div>
          <br />
          <span className="procedure__modal-title">{t('page.presale.modaTitle.3')}</span>
          <br />
          <b>To get HT and Heco USDT you may use exchanges that support HECO.</b>
          <p>For example, you may use</p>
          <br />
          <b>Huobi Global:</b>
          <br />
          <ul>
            <li>
              <a
                href="https://www.huobi.com/en-us/exchange/ht_usdt"
                target="_blank"
                rel="nofollow noreferrer"
              >
                https://www.huobi.com/en-us/exchange/ht_usdt
              </a>{' '}
              to buy HT.
            </li>
            <li>
              choose the HECO protocol while withdrawing USDT to get HECO USDT on your MetaMask.{' '}
            </li>
          </ul>
          <br />
          <b>GAte.io</b>
          <br />
          <ul>
            <li>
              <a href="https://www.gate.io/trade/HT_USDT" target="_blank" rel="nofollow noreferrer">
                https://www.gate.io/trade/HT_USDT
              </a>
            </li>
            <li>
              choose the HECO protocol while withdrawing USDT to get HECO USDT on your MetaMask.
            </li>
          </ul>
        </div>
      );
    }

    return (
      <div>
        <br />
        <span className="procedure__modal-title">Data not found</span>
      </div>
    );
  }

  return (
    <div className={cn('procedure', theme)}>
      <div className="procedure__content">
        <div
          className={cn('procedure__title h1-md text-bold', {
            'text-white': theme === 'dark',
            'text-black': theme === 'light',
          })}
        >
          {title.one} <span className="procedure__title-accent">{title.two}</span>
        </div>

        <Modal
          className="procedure__modal"
          centered
          visible={showModal}
          onOk={() => setShowModal(false)}
          onCancel={() => setShowModal(false)}
          footer={null}
        >
          <ModalInfo name={infoModal} />
        </Modal>

        <div className="procedure__content-links">
          <span
            key={nextId()}
            role="button"
            tabIndex={0}
            onKeyDown={() => {
              setShowModal(true);
              setInfoModal('add');
            }}
            onClick={() => {
              setShowModal(true);
              setInfoModal('add');
            }}
          >
            {t('page.presale.modaTitle.1')}
          </span>
          <span
            key={nextId()}
            role="button"
            tabIndex={0}
            onKeyDown={() => {
              setShowModal(true);
              setInfoModal('set');
            }}
            onClick={() => {
              setShowModal(true);
              setInfoModal('set');
            }}
          >
            {t('page.presale.modaTitle.2')}
          </span>
          <span
            key={nextId()}
            role="button"
            tabIndex={0}
            onKeyDown={() => {
              setShowModal(true);
              setInfoModal('buy');
            }}
            onClick={() => {
              setShowModal(true);
              setInfoModal('buy');
            }}
          >
            {t('page.presale.modaTitle.3')}
          </span>
        </div>

        <div className="procedure__separate">
          <span>{holdTime}</span>
        </div>

        <div className="procedure__text">
          {underHoldText.one}
          <br />
          {underHoldText.two}
        </div>

        <div className="procedure__slide">
          <div className="procedure__slide-content">
            {slider.data.map((item) => (
              <div
                className={cn('procedure__slide-item', {
                  active: item.active,
                })}
                key={nextId()}
                role="button"
                tabIndex={0}
                onKeyDown={() => slider.onСlick(item.percent)}
                onClick={() => slider.onСlick(item.percent)}
              >
                <span className="procedure__slide-item-accent">{item.accent}</span>
                <div className="procedure__slide-item-img">
                  <img src={CheckIcon} alt="check icon" />
                </div>
                <span className="procedure__slide-item-days">
                  {item.days} {item.daysName}
                </span>
                <span className="procedure__slide-item-accent accent-second">{item.accent}</span>
                <div className="procedure__slide-item-line">
                  <span className="procedure__slide-item-line-active" />
                </div>
                <span className="procedure__slide-item-percent">{item.percent}%</span>
              </div>
            ))}
            <div className="procedure__slide-line">
              <span className="procedure__slide-line-bg" />
            </div>
          </div>
        </div>

        <div className="procedure__text">
          <span>{bonusText}</span>
        </div>

        <div className="procedure__text">
          <span>{afterBonusText.one}</span>
          <br />
          <span>{afterBonusText.two}</span>
        </div>

        <div className="procedure__separate">
          <span>{amountText}</span>
        </div>

        <div className="procedure__input">
          {miniButtonShow ? (
            <div className="procedure__input-title box-f-c">
              <span className="text-sm text-upper">{inputTitle}</span>
              <Button colorScheme="outline" size="ssm" onClick={btnClick}>
                <div
                  className={cn('text-sm text-upper', {
                    'text-white': theme === 'dark',
                    'text-black': theme === 'light',
                  })}
                >
                  {btnAllText}
                </div>
              </Button>
            </div>
          ) : (
            ''
          )}
          {inputButtonShow ? (
            <Input
              size="lg"
              placeholder="0.0"
              colorScheme="outline"
              type="number"
              shadow={theme === 'light'}
              onChange={(e) => inputChange(e.target.value)}
              value={inputValue}
            />
          ) : (
            ''
          )}

          <div className="procedure__input-ratio">
            {ratio.title}:
            <span>
              {ratio.first.value} {ratio.first.title} = {ratio.second.value} {ratio.second.title}
            </span>
          </div>
          {infoText ? <div className="procedure__input-info">{infoText}</div> : ''}
        </div>

        <div className="procedure__separate">
          <span>{youGetText}</span>
        </div>

        <div className="procedure__input get-input">
          {inputButtonShow ? (
            <div className="procedure__input-wrap">
              <Input
                size="lg"
                placeholder="0.0"
                colorScheme="green"
                type="number"
                onChange={(e) => getInputChange(e.target.value)}
                shadow={theme === 'light'}
                value={getValue}
              />
              <span className="procedure__input-text">{getInputTitle}</span>
            </div>
          ) : (
            ''
          )}

          <div className="procedure__text m-30 op-5">
            <span>
              {withBonusText} {percentBonus}%:
              {Number.isNaN(+getValue)
                ? 0
                : parseFloat((+getValue + +getValue * (+percentBonus / 100)).toFixed(4))}{' '}
              BTCMT
            </span>
          </div>

          {stopSell ? (
            <Button disabled className="procedure__submit" size="lmd">
              <span className="text-upper text-slg">{soldOutText}</span>
            </Button>
          ) : btnProcessed ? (
            <Button disabled className="procedure__submit" size="lmd">
              <span className="text-upper text-slg">{btnProcessedText}</span>
            </Button>
          ) : (
            <Button className="procedure__submit" size="lmd" onClick={() => buttonClick(inputType)}>
              <span className="text-upper text-slg">{submitBtnText}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Procedure;
