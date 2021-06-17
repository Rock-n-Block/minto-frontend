import React from 'react';
import { NavLink } from 'react-router-dom';
import Web3 from 'web3';

import { useStore } from '../../../../store';
import { IData } from '../../../../types';
import { clogData, dataToObject, normalizedValue } from '../../../../utils';
import { Button, Info } from '../../../atoms';

import './HomePreview.scss';
import { useTranslation } from 'react-i18next';
import { contracts, config } from '../../../../config';

const HomePreview: React.FC = () => {
  const store = useStore();

  const [info, setInfo] = React.useState({ available: '-', totalSupply: '-' } as IData);
  const [firstStart, setFirstStart] = React.useState(true);
  const [gotWeb3Data, setGotWeb3Data] = React.useState(false);

  const { t } = useTranslation();

  const getInfoFromWeb3 = async () => {
    setGotWeb3Data(true);

    const w3 = new Web3(config.provider);
    const web3Contract = [] as any;

    contracts.names.forEach((name: string) => {
      const contractData = contracts.params[name.toUpperCase()][contracts.type];
      const contract = new w3.eth.Contract(contractData.abi, contractData.address);
      web3Contract[name] = contract;
    });

    const promises = [
      web3Contract.Token.methods
        .totalSupply()
        .call()
        .then((value: string) => {
          clogData('totalSupply (totalSupply): ', value);
          return {
            key: 'totalSupply',
            value: normalizedValue(value),
          };
        }),
    ];

    const uinfo = await Promise.all(promises).then((results): IData => {
      return dataToObject(results, true, 'Main page normilized values');
    });

    setInfo(uinfo);
  };

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

  React.useEffect(() => {
    if (!store.account.address) {
      if (gotWeb3Data) return;
      getInfoFromWeb3();
      return;
    }
    if (!firstStart) return;
    getInfo();
  });

  return (
    <div className="home__preview">
      <div className="row">
        <h1 className="h1 text-bold home__preview-title">{t('page.home.title')}</h1>
        <div className="text-lg home__preview-subtitle">{t('page.home.subtitle')}</div>
        <div className="box-f box-f-ai-c home__preview-box">
          <Button size="lmd" className="home__preview-btn">
            <NavLink exact to="/staking" className="text-upper text-slg">
              {t('page.home.buttons.stake')}
            </NavLink>
          </Button>
          <Button size="md" colorScheme="outline" className="home__preview-btn">
            <div className="text-upper text-slg">{t('page.home.buttons.buy')}</div>
          </Button>
        </div>
        <div className="home__preview-info box-f box-f-ai-c">
          <Info
            content="$42"
            topText={t('page.home.tokenPrice')}
            className="home__preview-info-item"
          />
          <Info
            content={info.totalSupply}
            topText={t('page.home.totalSupply')}
            bottomText="BTCMT"
            className="home__preview-info-item"
          />
          {/* <Info
            content={info.availableToStake}
            topText="Total available"
            bottomText="BTCMT"
            className="home__preview-info-item"
          /> */}
        </div>
      </div>
    </div>
  );
};

export default HomePreview;
