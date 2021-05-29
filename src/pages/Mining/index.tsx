import React from 'react';
import { Procedure } from '../../components/organisms';

import './Mining.scss';

import BigNumber from 'bignumber.js/bignumber';
import { autorun } from 'mobx';
import CSS from 'csstype';

import { useStore } from '../../store';
import { config, contracts } from '../../config';

interface IMinigInfo {
  availableToClaim: string;
}

const Mining: React.FC = () => {
  const store = useStore();

  const [miningInfo, setMiningInfo] = React.useState({} as IMinigInfo);
  const [firstStart, setFirstStart] = React.useState(true);

  const [miningValue, setMiningValue] = React.useState('0');
  // const [withdrawValue, setWithdrawValue] = React.useState(0);

  const getStakingInfo = async () => {
    const decimals = new BigNumber(10).pow(contracts.decimals).toString();
    store.setDecimals(decimals);
    console.log('decimals', store.decimals);

    setFirstStart(false);

    console.log(store.contracts.Staking);
    console.log(store.account.address);

    const promises = [
      // From Token Contract - User Current Token
      // TODO: узнать поравильно ли использовать метод balanceOfLocked
      // TODO: обновить на balancedOf
      store.contracts.Token.methods
        .balanceOfSum(store.account.address)
        .call()
        .then((value: string) => {
          console.log(value);
          // const balance = new BigNumber(value)
          //   .div(new BigNumber(10).pow(contracts.decimals))
          //   .toString();
          // store.updateAccount({ balance });
          return {
            key: 'availableToClaim',
            value: new BigNumber(value).div(store.decimals).toString(),
          };
        }),
    ];

    const nminingInfo = await Promise.all(promises).then((results): Promise<IMinigInfo> => {
      const values: any = {};
      results.forEach((v: { key: string; value: string }) => {
        console.log(v);
        values[v.key] = v.value;
      });
      return values;
    });

    setMiningInfo(nminingInfo);
    console.log(miningInfo);
  };

  const handleButtonClaimClick = (value: any) => {
    console.log(value);

    store.contracts.Staking.methods
      .withdrawRewardAll()
      .send({
        from: store.account.address,
      })
      .then(
        (info: any) => console.log('got claim', info),
        (err: any) => console.log('claim err: ', err),
      );
  };

  const handleButtonClick = () => {
    console.log('handleButtonClick');
    setMiningValue(miningInfo.availableToClaim);
  };

  autorun(() => {
    if (!store.account.address) return;
    if (!firstStart) return;
    getStakingInfo();
  });

  React.useEffect(() => {
    if (!store.account.address) return;
    if (!firstStart) return;
    getStakingInfo();
  });

  React.useEffect(() => {
    if (!store.account.address && config.menu.onlyForAuth) {
      store.toggleWalletMenu(true);
    }
  }, [store]);

  const h1Styles: CSS.Properties = {
    bottom: '2rem',
    padding: '0.5rem',
    fontFamily: 'sans-serif',
    fontSize: '1.5rem',
    textAlign: 'center',
    color: 'black',
    marginTop: '250px',
    marginBottom: '150px',
  };

  return (
    <div className="mining">
      {store.account.address ? (
        <Procedure
          title="Mining"
          info={[
            {
              title: 'Your mining power equivalent',
              value: '300 TH/s',
            },
            {
              title: 'Available to claim',
              value: `${miningInfo.availableToClaim} HBTC`,
            },
          ]}
          inputTitle="Amount"
          btnAllText="All available"
          btnClick={handleButtonClick}
          submitBtnText="Claim"
          buttonClick={handleButtonClaimClick}
          inputValue={miningValue}
        />
      ) : (
        <div style={h1Styles}>
          <span className="links__title text-center text text-black text-bold-e">
            Please LogIn to see Information
          </span>
        </div>
      )}
    </div>
  );
};

export default Mining;
