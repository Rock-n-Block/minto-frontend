import React from 'react';

import { IData } from '../../../../types';
import { Info } from '../../../atoms';

import './StakingInfo.scss';

interface IStakingInfo {
  info: IData;
  token: string;
}

const StakingInfo: React.FC<IStakingInfo> = ({ info, token }) => {
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
