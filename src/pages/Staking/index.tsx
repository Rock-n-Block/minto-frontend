import React from 'react';

import BigNumber from 'bignumber.js';
import { Procedure } from '../../components/organisms';
import { StakingInfo } from '../../components/sections';

import { useStore } from '../../store';
import { config, contracts } from '../../config';

interface IStakingInfo {
  tokenPrize: string;
  totalSupply: string;
  alreadyStaked: string;
  availableToStale: string;
}

const Staking: React.FC = () => {
  const store = useStore();

  const {
    account: { address },
  } = store;

  const [stakingInfo, setStakingInfo] = React.useState({} as IStakingInfo);
  const [firstStart, setFirstStart] = React.useState(true);

  const getStakingInfo = async () => {
    setFirstStart(false);

    console.log(store.contracts.Staking);
    const promises = [
      // From Marketcap
      // TODO: узнать как получить данное поле
      store.contracts.Staking.methods
        .nowTotalStakers()
        .call()
        .then((value: string) => {
          return {
            key: 'tokenPrize',
            value: new BigNumber(value).div(contracts.decimals).toString(),
          };
        }),
      // From Token Contract
      store.contracts.Token.methods
        .totalSupply()
        .call()
        .then((value: string) => {
          return {
            key: 'totalSupply',
            value: new BigNumber(value).div(contracts.decimals).toString(),
          };
        }),
      // From Token Contract - User Has Staked
      // TODO: узнать как получить данное поле
      store.contracts.Staking.methods
        .nowTotalMined()
        .call()
        .then((value: string) => {
          return {
            key: 'alreadyStaked',
            value: new BigNumber(value).div(contracts.decimals).toString(),
          };
        }),
      // From Token Contract - User Current Token
      // TODO: узнать поравильно ли использовать метод balanceOfLocked
      store.contracts.Token.methods
        .balanceOfLocked(address)
        .call()
        .then((value: string) => {
          return {
            key: 'availableToStale',
            value: new BigNumber(value).div(contracts.decimals).toString(),
          };
        }),
    ];

    const nstakingInfo = await Promise.all(promises).then((results): Promise<IStakingInfo> => {
      const values: any = {};
      results.forEach((v: { key: string; value: string }) => {
        values[v.key] = v.value;
      });
      return values;
    });

    setStakingInfo(nstakingInfo);
  };

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

  return (
    <div className="staking">
      <StakingInfo info={stakingInfo} token="BTCMT" />
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
