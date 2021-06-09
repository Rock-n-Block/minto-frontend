import React from 'react';
import { NavLink } from 'react-router-dom';
import { autorun } from 'mobx';

import { useStore } from '../../../../store';
import { IData } from '../../../../types';
import { clogData, dataToObject, normalizedValue } from '../../../../utils';
import { Button, Info } from '../../../atoms';

import './HomePreview.scss';

const HomePreview: React.FC = () => {
  const store = useStore();

  const [info, setInfo] = React.useState({ available: '-', totalSupply: '-' } as IData);
  const [firstStart, setFirstStart] = React.useState(true);

  const getInfo = async () => {
    setFirstStart(false);

    const promises = [
      store.contracts.Token.methods
        .totalSupply()
        .call()
        .then((value: string) => {
          clogData('totalSupply (totalSupply): ', value);
          return {
            key: 'totalSupply',
            value: normalizedValue(value),
          };
        }),
      store.contracts.Token.methods
        .balanceOfSum(store.account.address)
        .call()
        .then((value: string) => {
          clogData('balanceOfSum (availableToStake): ', value);
          return {
            key: 'availableToStake',
            value: normalizedValue(value),
          };
        }),
    ];

    const uinfo = await Promise.all(promises).then((results): IData => {
      return dataToObject(results, true, 'Main page normilized values');
    });

    setInfo(uinfo);
  };

  autorun(() => {
    if (!store.account.address) return;
    if (!firstStart) return;
    getInfo();
  });

  React.useEffect(() => {
    if (!store.account.address) return;
    if (!firstStart) return;
    getInfo();
  });

  return (
    <div className="home__preview">
      <div className="row">
        <h1 className="h1 text-bold home__preview-title">Mine Bitcoin by staking BTCMT tokens</h1>
        <div className="text-lg home__preview-subtitle">
          We&apos;ve removed all the unnecessary steps and made mining easier than getting a BTC
          wallet
        </div>
        <div className="box-f box-f-ai-c home__preview-box">
          <Button size="lmd" className="home__preview-btn">
            <NavLink exact to="/staking" className="text-upper text-slg">
              Stake
            </NavLink>
          </Button>
          <Button size="md" colorScheme="outline" className="home__preview-btn">
            <div className="text-upper text-slg">Buy</div>
          </Button>
        </div>
        <div className="home__preview-info box-f box-f-ai-c">
          <Info content="$42" topText="Token Price" className="home__preview-info-item" />
          <Info
            content={info.totalSupply}
            topText="Total Supply"
            bottomText="BTCMT"
            className="home__preview-info-item"
          />
          <Info
            content={info.availableToStake}
            topText="Total available"
            bottomText="BTCMT"
            className="home__preview-info-item"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePreview;
