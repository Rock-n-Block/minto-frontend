import React from 'react';

import { Info } from '../../../atoms';

import './StakingInfo.scss';

const StakingInfo: React.FC = () => {
  return (
    <div className="staking__info">
      <div className="row">
        <div className="staking__info-content">
          <Info topText="Token Price" content="$42" />
          <Info topText="Total Supply" content="9,2 M" bottomText="BTCMT" />
          <Info topText="Available to stake" content="3,0 M" bottomText="BTCMT" />
          <Info topText="Already staked" content="$6,2 M" bottomText="BTCMT" />
        </div>
      </div>
    </div>
  );
};

export default StakingInfo;
