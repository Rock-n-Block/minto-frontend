import React from 'react';
import nextId from 'react-id-generator';
import cn from 'classnames';

import { Button, Input } from '../../atoms';

import './Procedure.scss';

interface IInfoItem {
  title: string;
  value: string;
  src?: any;
}

interface IGrouoItems {
  info: IInfoItem[];

  inputMiniButtonShow?: boolean;
  inputMiniButtonTitle?: string;
  inputMiniButtonText: string;
  inputMiniButtonClick?: any;

  inputButtonShow?: boolean;
  inputType?: string;
  inputChange: any;
  inputValue?: any;
  inputMax?: number;
}

interface IProcedure {
  theme?: 'light' | 'dark';
  title: string;
  gropupItems: IGrouoItems[];
  submitBtnText: string;
  buttonClick: any;
  btnProcessed?: boolean;
  btnProcessedText?: string;
}

const Procedure2: React.FC<IProcedure> = ({
  theme = 'dark',
  title,
  gropupItems,
  submitBtnText,
  buttonClick,
  btnProcessed = false,
  btnProcessedText = 'Please Wait...',
}) => {
  return (
    <div className={cn('procedure-two', theme)}>
      <div className="procedure-two__content">
        <div
          className={cn('procedure-two__title h1-md text-bold', {
            'text-white': theme === 'dark',
            'text-black': theme === 'light',
          })}
        >
          {title}
        </div>

        {gropupItems.map((gItem) => (
          <div className="procedure-two__info-wrap">
            <div className="procedure-two__info">
              {gItem.info.map((item) => (
                <div className="procedure-two__info-item" key={nextId()}>
                  <div className="procedure-two__info-item-title text-md text-green text-upper">
                    {item.src ? <img src={item.src} alt="" /> : ''}
                    {item.title}
                  </div>
                  <div
                    className={cn('procedure-two__info-item-value text-md text-upper', {
                      'text-white': theme === 'dark',
                      'text-black': theme === 'light',
                    })}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="procedure-two__input">
              {gItem.inputMiniButtonShow ? (
                <div className="procedure-two__input-title box-f">
                  <span className="text-sm">{gItem.inputMiniButtonTitle}</span>
                  <Button colorScheme="outline" size="ssm" onClick={gItem.inputMiniButtonClick}>
                    <div
                      className={cn('text-sm', {
                        'text-white': theme === 'dark',
                        'text-black': theme === 'light',
                      })}
                    >
                      {gItem.inputMiniButtonText}
                    </div>
                  </Button>
                </div>
              ) : (
                ''
              )}
              {gItem.inputButtonShow ? (
                <Input
                  size="lg"
                  placeholder="0.0"
                  colorScheme="outline"
                  type="number"
                  shadow={theme === 'light'}
                  onChange={(e) => gItem.inputChange(e.target.value)}
                  value={gItem.inputValue}
                  max={gItem.inputMax}
                />
              ) : (
                ''
              )}
            </div>
          </div>
        ))}

        {btnProcessed ? (
          <Button disabled className="procedure-two__submit" size="lmd">
            <span className="text-upper text-slg">{btnProcessedText}</span>
          </Button>
        ) : (
          <Button className="procedure-two__submit" size="lmd" onClick={() => buttonClick()}>
            <span className="text-upper text-slg">{submitBtnText}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Procedure2;
