import React from 'react';

// import { StakingInfo } from '../../components/sections';
import { useStore } from '../../store';

import './Admin.scss';

const Admin: React.FC = () => {
  const store = useStore();

  return (
    <div className="admin">
      {store.account.address ? (
        // <StakingInfo info={stakingInfo} token="BTCMT" />
        'Text'
      ) : (
        <div className="admin-login">
          <form>
            <input type="email" required placeholder="email" />
            <input type="password" required placeholder="password" />
            <button type="submit">Log In</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;
