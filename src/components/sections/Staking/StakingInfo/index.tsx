import React from 'react';

// import { getFloatWithSuffix } from '../../../../utils/Calculate';
import { Info } from '../../../atoms';

import './StakingInfo.scss';

interface IStakingInfo {
  info: {
    tokenPrize: string;
    totalSupply: string;
    alreadyStaked: string;
    availableToStake: string;
    availableToStakeLocked: string;
  };
  token: string;
}

const StakingInfo: React.FC<IStakingInfo> = ({ info, token }) => {
  // const convertToInternationalCurrencySystem = (labelValue: string) => {
  //   // Nine Zeroes for Billions
  //   return Math.abs(Number(labelValue)) >= 1.0e9
  //     ? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + 'B'
  //     : // Six Zeroes for Millions
  //     Math.abs(Number(labelValue)) >= 1.0e6
  //     ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + 'M'
  //     : // Three Zeroes for Thousands
  //     Math.abs(Number(labelValue)) >= 1.0e3
  //     ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + 'K'
  //     : Math.abs(Number(labelValue));
  // };

  return (
    <div className="staking__info">
      <div className="row">
        <div className="staking__info-content">
          <Info topText="Token Price" content={info.tokenPrize} bottomText={token} />
          <Info topText="Total Supply" content={info.totalSupply} bottomText={token} />
          <Info topText="Available to stake" content={info.availableToStake} bottomText={token} />
          <Info topText="Total staked" content={info.alreadyStaked} bottomText={token} />
        </div>
      </div>
    </div>
  );
};

export default StakingInfo;
