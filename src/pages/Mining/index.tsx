import React from 'react';
import BigNumber from 'bignumber.js/bignumber';
import CSS from 'csstype';
import { autorun } from 'mobx';

import { Procedure } from '../../components/organisms';

import { config, contracts } from '../../config';
import { IMinigInfo } from '../../types';
import { useStore } from '../../store';

import './Mining.scss';

const Mining: React.FC = () => {
  const store = useStore();

  const [miningInfo, setMiningInfo] = React.useState({} as IMinigInfo);
  const [firstStart, setFirstStart] = React.useState(true);

  const [miningValue, setMiningValue] = React.useState(0);
  const [miningProgress, setMiningProgress] = React.useState(false);

  const getMiningInfo = async () => {
    const decimals = new BigNumber(10).pow(contracts.decimals).toString();
    store.setDecimals(decimals);
    setFirstStart(false);

    if (!store.is_contractService) {
      store.setContractService();
      console.log('info', store.contractService);
    }

    const info = await store.contractService.miningInfo();
    setMiningInfo(info);
  };

  const handleChangeClaimAmount = (value: any) => {
    setMiningValue(value);
    if (value < 0) setMiningValue(0);
    if (value > +miningInfo.availableToClaim) setMiningValue(+miningInfo.availableToClaim);
  };

  const handleButtonClaimClick = () => {
    setMiningProgress(true);
    store.contracts.Staking.methods
      .withdrawRewardAll()
      .send({
        from: store.account.address,
      })
      .then(
        (info: any) => {
          console.log('got claim', info);
          setTimeout(() => {
            getMiningInfo();
          }, 10000);
        },
        (err: any) => console.log('claim err: ', err),
      )
      .finally(() => setMiningProgress(false));
  };

  const handleButtonClick = () => {
    setMiningValue(+miningInfo.availableToClaim);
  };

  autorun(() => {
    if (!store.account.address) return;
    if (!firstStart) return;
    getMiningInfo();
  });

  React.useEffect(() => {
    if (!store.account.address) return;
    if (!firstStart) return;
    getMiningInfo();
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
              value: `${miningInfo.th} TH/s`,
            },
            {
              title: 'Available to claim',
              value: `${miningInfo.availableToClaim} HBTC`,
            },
          ]}
          miniButtonShow={false}
          inputTitle="Amount"
          btnAllText="All available"
          btnClick={handleButtonClick}
          submitBtnText="Claim"
          inputButtonShow={false}
          btnProcessed={miningProgress}
          btnProcessedText="Processing..."
          buttonClick={handleButtonClaimClick}
          inputChange={handleChangeClaimAmount}
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
