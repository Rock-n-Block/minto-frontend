import React from 'react';

import { StakingInfo } from '../../components/sections';
import { Procedure } from '../../components/organisms';

const Staking: React.FC = () => {
  return (
    <div className="staking">
      <StakingInfo />
      <Procedure
        title="Stake your tokens"
        info={[
          {
            title: 'In your wallet',
            value: '35.989.445 BTCMT',
          },
          {
            title: 'You already staked',
            value: '100.000 BTCMT',
          },
        ]}
        inputTitle="Amount to stake"
        btnAllText="All available"
        submitBtnText="Stake"
      />
      <Procedure
        title="Withdraw"
        theme="light"
        info={[
          {
            title: 'You already staked',
            value: '100.000 BTCMT',
          },
        ]}
        inputTitle="Amount to Withdraw"
        btnAllText="All available"
        submitBtnText="Withdraw"
      />
    </div>
  );
};

export default Staking;
