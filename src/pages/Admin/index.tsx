import React, { useCallback } from 'react';
import { observer } from 'mobx-react-lite';

import { Button, Input } from '../../components/atoms';
import { HeaderAdmin } from '../../components/organisms';
import AdminContent from '../../components/sections/Admin/AdminContent';
import { config } from '../../config';
import { useStore } from '../../store';
import { customNotify, deNormalizedValue, isAddress, notify, rolesByHex } from '../../utils';

import './Admin.scss';

const Admin: React.FC = () => {
  const store = useStore();

  const [mtAmount, setMtAmount] = React.useState(0);
  const [mtAddress, setMtAddress] = React.useState('');
  const [btnProceed, setBtnProceed] = React.useState(false);

  const [logIn, setLogIn] = React.useState(false);
  const [logInEmail, setLogInEmail] = React.useState('');
  const [logInPassword, setLogInPassword] = React.useState('');

  const getInfo = useCallback(async () => {
    if (!store.is_contractService) store.setContractService();
  }, [store]);

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
      notify('Please, input value in mint field.', 'error');
      return;
    }

    if (mtAddress.length === 0 && mtAddress.length <= 0) {
      notify('Please fill mint address field.', 'error');
      return;
    }

    if (!isAddress(mtAddress)) {
      notify('Invalid address.', 'error');
      return;
    }

    setBtnProceed(true);

    store.contractService.hasRole().then((user: { role: string; has_role: boolean }) => {
      if (!user.has_role) {
        notify(`You can't Mint because don't have ${rolesByHex[user.role].role} Role`, 'error');
        setBtnProceed(false);
      }

      if (user.has_role) {
        store.contractService
          .mintLockedTokens(mtAddress, deNormalizedValue(mtAmount))
          .then((data: string) => {
            notify(
              customNotify({
                text: `You Mint ${mtAmount} Locked BTCMT to address ${mtAddress}!`,
                link: {
                  url: `${config.tx.link}/${data}`,
                  text: 'View tx',
                },
              }),
              'success',
            );
          })
          .finally(() => {
            setBtnProceed(false);
            setMtAmount(0);
          });
      }
    });
  };

  const userLogIn = () => {
    if (logInEmail !== 'admin@admin.admin' || logInPassword !== 'admin') {
      notify(`Email or Password are not valid`, 'error');
      return;
    }

    setLogIn(true);
    notify(`Successfully login via ${logInEmail}.`, 'success');
  };

  const userLogOut = () => {
    setLogInEmail('');
    setLogInPassword('');
    setLogIn(false);
    notify(`Successfully logout from Admin account.`, 'success');
  };

  // On Run ------------------------------------------------

  React.useEffect(() => {
    if (!store.account.address) return;
    getInfo();
  }, [getInfo, store.account.address]);

  // Template ------------------------------------------------

  return (
    <div className="admin">
      <HeaderAdmin isLogin={logIn} onLogOut={userLogOut} />
      {!logIn ? (
        <form
          className="admin-login"
          onSubmit={(e) => {
            e.preventDefault();
            userLogIn();
          }}
        >
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
          <Button type="submit" size="lmd">
            <span className="text-upper text-slg">Log In</span>
          </Button>
        </form>
      ) : store.account.address ? (
        <AdminContent
          items={[
            {
              title: 'Amount of Locked tokens (ex.: 1 = 1 token)',
              inputType: 'number',
              inputChange: handleChangeMtAmount,
              inputValue: mtAmount.toString(),
            },
            {
              title: 'Address to Mint Locked tokens',
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
        <div className="no_login_data">
          <span className="links__title text-center text text-black text-bold-e">
            Please Connect Wallet to see Information.
          </span>
        </div>
      )}
    </div>
  );
};

export default observer(Admin);
