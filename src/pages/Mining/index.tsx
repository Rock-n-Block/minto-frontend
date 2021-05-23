import React from 'react';

import { Procedure } from '../../components/organisms';

import './Mining.scss';

const Mining: React.FC = () => {
  return (
    <div className="mining">
      <Procedure
        title="Mining"
        info={[
          {
            title: 'Your mining power equivalent',
            value: '300 TH/s',
          },
          {
            title: 'Available to claim',
            value: '100.000 HBTC',
          },
        ]}
        inputTitle="Amount"
        btnAllText="All available"
        submitBtnText="Claim"
      />
    </div>
  );
};

export default Mining;
