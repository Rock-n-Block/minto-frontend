import React from 'react';
import { observer } from 'mobx-react-lite';

import { Button, Input } from '../../components/atoms';
import AdminContent from '../../components/sections/Admin/AdminContent';
import { useStore } from '../../store';
import { notify } from '../../utils';

import './Admin.scss';

const Admin: React.FC = () => {
  const store = useStore();

  const [mtAmount, setMtAmount] = React.useState(0);
  const [mtAddress, setMtAddress] = React.useState('');
  const [btnProceed, setBtnProceed] = React.useState(false);

  const [logInEmail, setLogInEmail] = React.useState('');
  const [logInPassword, setLogInPassword] = React.useState('');

  // Change amounts ------------------------------------------------

  const handleChangeMtAmount = (value: number) => {
    setMtAmount(value);
    if (value < 0) setMtAmount(0);
  };

  const handleChangeMtAddress = (value: string) => {
    setMtAddress(value);
  };

  // Button Clicks ------------------------------------------------

  const handleMtButtonClick = () => {
    if (+mtAmount === 0 && +mtAmount <= 0) {
      notify('Please, input value in mint field (both or one).', 'error');
      return;
    }

    setBtnProceed(!btnProceed);
  };

  const handleLogInButtonClick = () => {
    console.log('handleLogInButtonClick');
  };

  return (
    <div className="admin">
      {store.account.address ? (
        <AdminContent
          items={[
            {
              title: 'Amount tokens to be issued',
              inputType: 'number',
              inputChange: handleChangeMtAmount,
              inputValue: mtAmount.toString(),
            },
            {
              title: 'Amount tokens to be issued',
              inputType: 'text',
              inputChange: handleChangeMtAddress,
              inputValue: mtAddress,
            },
          ]}
          btnClick={handleMtButtonClick}
          btnText="Mint"
          btnProcessed={btnProceed}
          btnProcessedText="Minting..."
        />
      ) : (
        <div className="admin-login">
          <span className="admin-login-title">Log in</span>
          <Input
            size="md"
            placeholder="0.0"
            colorScheme="outline"
            type="email"
            onChange={(e) => setLogInEmail(e.target.value)}
            value={logInEmail}
            required
            shadow
          />
          <Input
            size="md"
            placeholder="0.0"
            colorScheme="outline"
            type="password"
            onChange={(e) => setLogInPassword(e.target.value)}
            value={logInPassword}
            required
            shadow
          />
          <Button size="lmd" onClick={() => handleLogInButtonClick()}>
            <span className="text-upper text-slg">Log In</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default observer(Admin);
