import React from 'react';
import cn from 'classnames';

import './Info.scss';

interface IInfo {
  topText?: React.ReactElement | string;
  bottomText?: React.ReactElement | string;
  content: React.ReactElement | string;
  className?: string;
}

const Info: React.FC<IInfo> = ({ topText, bottomText, content, className }) => {
  return (
    <div className={cn('info', className || '')}>
      <div className="info__text text-gray text-sm text-upper">{topText}</div>
      <div className="info__content text-bold h2-lg">{content}</div>
      <div className="info__text info__text-bottom text-gray text-sm text-upper">{bottomText}</div>
    </div>
  );
};

export default Info;
