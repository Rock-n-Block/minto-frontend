import React from 'react';
import nextId from 'react-id-generator';
import cn from 'classnames';

import { Button, Input } from '../../atoms';

import './Procedure.scss';

interface IInfoItem {
  title: string;
  value: string;
}

interface IProcedure {
  theme?: 'light' | 'dark';
  title: string;
  info: IInfoItem[];
  inputTitle: string;
  btnAllText: string;
  submitBtnText: string;
}

const Procedure: React.FC<IProcedure> = ({
  theme = 'dark',
  title,
  info,
  inputTitle,
  btnAllText,
  submitBtnText,
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
          {title}
        </div>
        <div
          className={cn('procedure__info', {
            'box-f box-f-jc-c text-center': info.length === 1,
            'box-f-jc-sb box-f-ai-c': info.length > 1,
          })}
        >
          {info.map((item) => (
            <div className="procedure__info-item" key={nextId()}>
              <div className="procedure__info-item-title text-md text-green text-upper">
                {item.title}
              </div>
              <div
                className={cn('procedure__info-item-value text-md text-upper', {
                  'text-white': theme === 'dark',
                  'text-black': theme === 'light',
                })}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
        <div className="procedure__input">
          <div className="procedure__input-title box-f-c">
            <span className="text-sm">{inputTitle}</span>
            <Button colorScheme="outline" size="ssm">
              <div
                className={cn('text-sm', {
                  'text-white': theme === 'dark',
                  'text-black': theme === 'light',
                })}
              >
                {btnAllText}
              </div>
            </Button>
          </div>
          <Input
            size="lg"
            placeholder="0.0"
            colorScheme="outline"
            type="number"
            shadow={theme === 'light'}
          />
          <Button className="procedure__submit" size="lmd">
            <span className="text-upper text-slg">{submitBtnText}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Procedure;
