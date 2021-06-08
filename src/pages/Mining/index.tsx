import React from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { autorun } from 'mobx';

import { Procedure } from '../../components/organisms';
import { config, contracts, update_after_tx_timeout } from '../../config';
import { useStore } from '../../store';
import { IData } from '../../types';
import { clogData, customNotify, notify } from '../../utils';

import './Mining.scss';

const Mining: React.FC = () => {
  const store = useStore();

  const [miningInfo, setMiningInfo] = React.useState({} as IData);
  const [firstStart, setFirstStart] = React.useState(true);

  const [miningValue, setMiningValue] = React.useState(0);
  const [miningProgress, setMiningProgress] = React.useState(false);

  const getMiningInfo = async () => {
    setFirstStart(false);

    if (!store.is_contractService) store.setContractService();
    store.setDecimals(new BigNumber(10).pow(contracts.decimals).toString());

    setMiningInfo(await store.contractService.miningInfo());
  };

  const handleChangeClaimAmount = (value: any): void => {
    setMiningValue(value);
    if (value < 0) setMiningValue(0);
    if (value > +miningInfo.availableToClaim) setMiningValue(+miningInfo.availableToClaim);
  };

  const handleButtonClaimClick = (): void => {
    setMiningProgress(true);

    store.contractService
      .withdrowAllReward()
      .then(
        (data: any) => {
          notify(
            customNotify({
              text: 'Your claim complete!',
              link: {
                url: `${config.tx.link}/${data[1]}`,
                text: 'View tx',
              },
            }),
            'success',
          );
          setTimeout(() => {
            getMiningInfo();
          }, update_after_tx_timeout);
        },
        (err: any) => clogData('claim err: ', err),
      )
      .finally(() => {
        setMiningProgress(false);
        setMiningValue(0);
      });
  };

  const handleButtonClick = (): void => {
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
        <div className="no_login_data">
          <span className="links__title text-center text text-black text-bold-e">
            Please LogIn to see Information
          </span>
        </div>
      )}
    </div>
  );
};

export default Mining;
