import React from 'react';
import { Procedure } from '../../components/organisms';

import './Mining.scss';

import { useStore } from '../../store';
import { config } from '../../config';

const Mining: React.FC = () => {
  const store = useStore();

  React.useEffect(() => {
    if (!store.account.address && config.menu.onlyForAuth) {
      console.log('Mining', store.menu.walletsOpen, config.menu.onlyForAuth);
      store.toggleWalletMenu(true);
    }
  }, [store]);

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
