import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { Button, Input } from '../../components/atoms';
import { HeaderAdmin } from '../../components/organisms';
import AdminContent from '../../components/sections/Admin/AdminContent';
import { chain } from '../../config';
import { useStore } from '../../store';
import {
  API,
  clogData,
  customNotify,
  deNormalizedValue,
  isAddress,
  notify,
  rolesByHex,
} from '../../utils';

import './Admin.scss';

const Admin: React.FC = () => {
  const store = useStore();

  const storedJwt = localStorage.getItem('token');
  const [jwt, setJwt] = React.useState(storedJwt || null);

  const [mtAmount, setMtAmount] = React.useState(0);
  const [mtAddress, setMtAddress] = React.useState('');
  const [btnProceed, setBtnProceed] = React.useState(false);

  const [logIn, setLogIn] = React.useState(false);
  const [logInEmail, setLogInEmail] = React.useState('');
  const [logInPassword, setLogInPassword] = React.useState('');
  const [loginProcess, setLoginProcess] = React.useState(false);

  const { t } = useTranslation();

  const getInfo = useCallback(async () => {
    if (!store.is_contractService) store.setContractService();
    clogData('Jwt data: ', jwt);
  }, [store, jwt]);

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
        notify(`Can't do Mint because you don't have ${rolesByHex[user.role].role} Role.`, 'error');
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
                  url: `${chain.tx.link}/${data}`,
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

  const userLogIn = async () => {
    setLoginProcess(true);

    await API.post('/admin-panel/api/api-token-auth/', {
      username: logInEmail,
      password: logInPassword,
    })
      .then((res: any) => {
        clogData('User history: ', res);
        localStorage.setItem('token', res.data.token);
        setJwt(res.data.token);
        setLogIn(true);
        notify(`Successfully login via ${logInEmail}.`, 'success');
      })
      .catch((error: any) => {
        if (error.response) {
          notify(`Email or Password are not valid`, 'error');
          clogData(`Login got error status ${error.response.status}: `, error.response.data);
        }
      })
      .finally(() => {
        setLoginProcess(false);
      });
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
            placeholder="Username"
            colorScheme="outline"
            type="text"
            onChange={(e) => setLogInEmail(e.target.value)}
            value={logInEmail}
            required
            shadow
          />
          <Input
            size="md"
            placeholder="Password"
            colorScheme="outline"
            type="password"
            onChange={(e) => setLogInPassword(e.target.value)}
            value={logInPassword}
            required
            shadow
          />

          {loginProcess ? (
            <Button disabled type="submit" size="lg">
              <span className="text-upper text-md">Processing...</span>
            </Button>
          ) : (
            <Button type="submit" size="lg">
              <span className="text-upper text-md">Log In</span>
            </Button>
          )}
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
              inputPlaceholder: 'Address to mint',
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
            {t('info.connectWallet')}
          </span>
        </div>
      )}
    </div>
  );
};

export default observer(Admin);
