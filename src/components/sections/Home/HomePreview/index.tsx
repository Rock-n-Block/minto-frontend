import React, { useCallback, useState, useEffect } from 'react';
import moment from 'moment';
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

  const currentTime = +(moment.utc().format('X')); // Timestamp - Sun, 21 Apr 2013 12:30:00 GMT
  const eventTime = +(moment.utc("2021-11-01T12:00:00").format('X')); // Timestamp - Sun, 21 Apr 2013 13:00:00 GMT
  // const eventTime = +(moment.utc().add(15, 'seconds').format('X')); // Timestamp - Sun, 21 Apr 2013 13:00:00 GMT
  const diffTime = eventTime - currentTime;
  const Duration: any = moment.duration(diffTime * 1000, 'milliseconds');
  const [timeLeft, setTimeLeft] = useState({ seconds: Duration.seconds(), minutes: Duration.minutes(), hours: Duration.hours(), days: Duration.days()});
  const [diffTimestamp, setDiffTimestamp] = useState(999999);

  useEffect(() => {
    let timerInterval: any;
    let duration: any = Duration;

    const startTimer = () => {
      const interval = 1000;

      if (duration.asSeconds() > 0) {
        timerInterval = setInterval(() => {
          if (duration.asSeconds() <= 1) {
            const links = document.querySelector('.links');
            links?.setAttribute("style", "display: block;");
          }
          duration = moment.duration(duration - interval, 'milliseconds');
          setDiffTimestamp(duration.asSeconds());
          setTimeLeft({ seconds: duration.seconds(), minutes: duration.minutes(), hours: duration.hours(), days: duration.days()});
        }, interval);
      } else {
        if (duration.asSeconds() <= 1) {
          // const links = document.querySelector('.links');
          // links?.setAttribute("style", "display: block;");
        }
        clearInterval(timerInterval);
        setDiffTimestamp(0);
      };

    };
    startTimer();
    return () => clearInterval(timerInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        clogData('available (available): ', '1,72 USD');
        resolve({
          key: 'available',
          value: (
            <>
              <div className="box-f-ai-c">
                <span>1,72</span>
              </div>
            </>
          ),
        });
      }),
      web3Contract.Token.methods
        .totalSupply()
        .call()
        .then(() => {
          clogData('totalSupply (totalSupply): ', '5 000 000');
          return {
            key: 'totalSupply',
            // value: normalizedValue(value),
            value: '5 000 000',
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
        {diffTimestamp > 0 ? (
          <div className="presale-timer">
          <span className="text">
            {t('page.home.timer.title')}
          </span>
            <div className="timer">
              <span className="block">{timeLeft.days}{t('page.home.timer.d')}</span>
              <span className="block">{timeLeft.hours}</span>
              <span className="block">{timeLeft.minutes}</span>
              <span className="block">{timeLeft.seconds}</span>
            </div>
          </div>
        ) : null}
        <div className="home__preview-box">
          {/* <Button size="lmd" className="home__preview-btn">
            <NavLink exact to="/staking" className="text-upper text-slg">
              {t('page.home.buttons.stake')}
            </NavLink>
          </Button> */}
          {/* <a
            className="home__preview-btn"
            rel="nofollow noreferrer"
            target="_blank"
            href={
              language === 'en'
                ? 'https://btcmt.typeform.com/to/TvDKWGwN'
                : 'https://btcmt.typeform.com/to/m2E3RYwP'
            }
          > */}
          {diffTimestamp > 0 ? (
            <Button size="md" colorScheme="green" className="home__preview-btn">
              <NavLink exact to="/presale" className="text-upper text-slg">
                <div className="text-upper text-slg">{t('page.home.buttons.buy')}</div>
              </NavLink>
            </Button>
          ) : (
            <div className="home__preview-btnGroup">
              <Button size="md" colorScheme="green" className="home__preview-btn">
                <NavLink exact to="/staking" className="text-upper text-slg">
                  <div className="text-upper text-slg">{t('page.home.buttons.stake')}</div>
                </NavLink>
              </Button>
              {/* <Button size="md" colorScheme="outline" className="home__preview-btn">
                <NavLink exact to="/purchase" className="text-upper text-slg">
                  <div className="text-upper text-slg">{t('page.home.buttons.buy2')}</div>
                </NavLink>
              </Button> */}
            </div>
          )}
          {/* </a> */}

          <div className="home__preview-links">
            <a
              href="https://medium.com/@btcmtofficial/a-guide-on-how-to-take-part-in-the-btcmt-presale-99874cf710d3"
              target="_blank"
              rel="nofollow noreferrer"
            >
              {t('page.home.links.4')}
            </a>
            <a
              href="https://medium.com/@btcmtofficial/a-detailed-guide-on-staking-42646d817f70"
              target="_blank"
              rel="nofollow noreferrer"
            >
              {t('page.home.links.5')}
            </a>
            <a
              href="https://medium.com/@btcmtofficial/how-to-configure-a-metamask-wallet-to-heco-mainnet-39c5d1f3ee23"
              target="_blank"
              rel="nofollow noreferrer"
            >
              {t('page.home.links.2')}
            </a>
            <a
              href="https://medium.com/@btcmtofficial/a-detailed-guide-on-staking-42646d817f70"
              target="_blank"
              rel="nofollow noreferrer"
            >
              {t('page.home.links.3')}
            </a>
          </div>
        </div>
        <div className="home__preview-info box-f box-f-ai-c">
          <Info
            content={info.available}
            topText={t('page.home.tokenPrice')}
            className="home__preview-info-item"
            bottomText="USD"
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
        {/* <div className="home__preview-info box-f box-f-ai-c">
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
        </div> */}
      </div>
    </div>
  );
};

export default HomePreview;
