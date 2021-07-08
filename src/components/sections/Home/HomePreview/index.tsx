import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import Web3 from 'web3';

import { chain, contracts } from '../../../../config';
import { useStore } from '../../../../store';
import { IData } from '../../../../types';
import { clogData, dataToObject, getDailyRewards } from '../../../../utils';
import { Button, Info } from '../../../atoms';

import './HomePreview.scss';

const HomePreview: React.FC = () => {
  const store = useStore();
  const { t } = useTranslation();

  const [info, setInfo] = React.useState({
    available: '-',
    totalSupply: '-',
    totalHashrate: '-',
    dailyRewards: '-',
    alreadyStaked: '-',
    allTimeMined: '-',
  } as IData);

  const getInfo = useCallback(async () => {
    const { address } = store.account;

    address ? (!store.is_contractService ? store.setContractService() : null) : null;
    const web3Contract = address ? store.contracts : ([] as any);

    if (!address) {
      const w3 = new Web3(chain.rpc);
      contracts.names.forEach((name: string) => {
        const contractData = contracts.params[name.toUpperCase()][contracts.type];
        web3Contract[name] = new w3.eth.Contract(contractData.abi, contractData.address);
      });
    }

    // TODO: Add dailyRewards from backend
    const promises = [
      new Promise((resolve) => {
        clogData('available (available): ', '-');
        resolve({
          key: 'available',
          value: '-',
        });
      }),
      web3Contract.Token.methods
        .totalSupply()
        .call()
        .then((value: string) => {
          clogData('totalSupply (totalSupply): ', value);
          return {
            key: 'totalSupply',
            // value: normalizedValue(value),
            value: '-',
          };
        }),
      new Promise((resolve) => {
        clogData('totalHashrate (totalHashrate): ', 50_000);
        resolve({
          key: 'totalHashrate',
          value: '50 000',
        });
      }),

      await getDailyRewards()
        .then((value: number) => {
          clogData('getDailyRewards (getDailyRewards): ', value);
          return {
            key: 'dailyRewards',
            // value: normalizedValue(value),
            value: '-',
          };
        })
        .catch((err: any) => clogData('daily reward error:', err)),
      web3Contract.Token.methods
        .balanceOfSum(contracts.params.STAKING[contracts.type].address)
        .call()
        .then((value: string) => {
          clogData('alreadyStaked (alreadyStaked): ', value);
          return {
            key: 'alreadyStaked',
            // value: normalizedValue(value),
            value: '-',
          };
        }),
      web3Contract.Staking.methods
        .allTimeTotalMined()
        .call()
        .then((value: string) => {
          clogData('allTimeMined (allTimeMined): ', value);
          return {
            key: 'allTimeMined',
            // value: normalizedValue(value),
            value: '-',
          };
        }),
    ];

    const uinfo = await Promise.all(promises).then((results): IData => {
      return dataToObject(results, true, 'Main page normilized values');
    });

    setInfo(uinfo);
  }, [store]);

  // On Run ------------------------------------------------

  React.useEffect(() => {
    getInfo();
  }, [getInfo, store.account.address, store]);

  // Template ------------------------------------------------

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
            content={info.available}
            topText={t('page.home.tokenPrice')}
            className="home__preview-info-item"
          />
          <Info
            content={info.totalSupply}
            topText={t('page.home.totalSupply')}
            bottomText="BTCMT"
            className="home__preview-info-item"
          />
          <Info
            content={info.totalHashrate}
            topText="Total hashrate"
            bottomText="TH/s"
            className="home__preview-info-item"
          />
        </div>
        <div className="home__preview-info box-f box-f-ai-c">
          <Info
            content={info.dailyRewards}
            topText="Daily rewards"
            bottomText="USD"
            className="home__preview-info-item"
          />
          <Info
            content={info.alreadyStaked}
            topText="Already staked"
            bottomText="BTCMT"
            className="home__preview-info-item"
          />
          <Info
            content={info.allTimeMined}
            topText="All time mined"
            bottomText="HBTC"
            className="home__preview-info-item"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePreview;
