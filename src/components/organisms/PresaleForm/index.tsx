import React from 'react';
import nextId from 'react-id-generator';
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
  infoText: string;
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
  inputMax?: number;
  getValue: any;
  getInputTitle: string;
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
}) => {
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

        <div className="procedure__separate">
          <span>Hold time</span>
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
          <span>bonus tokens will be added on top of the purchase amount</span>
        </div>

        <div className="procedure__separate">
          <span>Amount</span>
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

          <div className="procedure__input-info">{infoText}</div>
        </div>

        <div className="procedure__separate">
          <span>You’ll get</span>
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
          {btnProcessed ? (
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
