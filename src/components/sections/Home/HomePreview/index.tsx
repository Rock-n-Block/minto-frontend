import React from 'react';
import { NavLink } from 'react-router-dom';
import BigNumber from 'bignumber.js/bignumber';
import { autorun } from 'mobx';

import { contracts } from '../../../../config';
import { useStore } from '../../../../store';
import { Button, Info } from '../../../atoms';

import './HomePreview.scss';

interface IInfo {
  available: string;
  totalSupply: string;
}

const HomePreview: React.FC = () => {
  const store = useStore();

  const [info, setInfo] = React.useState({ available: '-', totalSupply: '-' } as IInfo);
  const [firstStart, setFirstStart] = React.useState(true);

  const getInfo = async () => {
    setFirstStart(false);

    const promises = [
      store.contracts.Token.methods
        .totalSupply()
        .call()
        .then((value: string) => {
          console.log('totalSupply', value);
          return {
            key: 'totalSupply',
            value: new BigNumber(value).div(store.decimals).toString(),
          };
        }),
      store.contracts.Token.methods
        .balanceOfSum(store.account.address)
        .call()
        .then((value: string) => {
          console.log(value);
          const balance = new BigNumber(value)
            .div(new BigNumber(10).pow(contracts.decimals))
            .toString();
          store.updateAccount({ balance });
          return {
            key: 'availableToStake',
            value: new BigNumber(value).div(store.decimals).toString(),
          };
        }),
    ];

    const uinfo = await Promise.all(promises).then((results): Promise<IInfo> => {
      const values: any = {};
      results.forEach((v: { key: string; value: string }) => {
        console.log(v);
        values[v.key] = v.value;
      });
      return values;
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
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia
          consequat duis enim velit mollit.
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
        </div>
      </div>
    </div>
  );
};

export default HomePreview;
