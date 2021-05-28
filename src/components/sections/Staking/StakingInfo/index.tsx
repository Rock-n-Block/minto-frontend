import React from 'react';

import { Info } from '../../../atoms';

import './StakingInfo.scss';

interface IStakingInfo {
  info: {
    tokenPrize: string;
    totalSupply: string;
    alreadyStaked: string;
    availableToStale: string;
  };
  token: string;
}

const StakingInfo: React.FC<IStakingInfo> = ({ info, token }) => {
  return (
    <div className="staking__info">
      <div className="row">
        <div className="staking__info-content">
          <Info topText="Token Price" content={info.tokenPrize} bottomText={token} />
          <Info topText="Total Supply" content={info.totalSupply} bottomText={token} />
          <Info topText="Available to stake" content={info.availableToStale} bottomText={token} />
          <Info topText="Already staked" content={info.alreadyStaked} bottomText={token} />
        </div>
      </div>
    </div>
  );
};

export default StakingInfo;
