import React, { useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import nextId from 'react-id-generator';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import Web3 from 'web3';

import { HistoryTable } from '../../components/organisms';
import { config, contracts } from '../../config';
import { useStore } from '../../store';
import { IData } from '../../types';
import { API, clogData, dataToObject, getDailyRewards, normalizedValue } from '../../utils';

import './Statistic.scss';

const Statistic: React.FC = () => {
  const store = useStore();

  // const [tdata, settData] = React.useState({ total: '0', history: [] } as IUserHistory);
  const [tdata, settData] = React.useState([]);
  const [chartButton, setChartButton] = React.useState(0);

  const [chartButtons, setChartButtons] = React.useState([
    {
      id: 1,
      title: '1d',
      active: true,
    },
    {
      id: 2,
      title: '1w',
      active: false,
    },
    {
      id: 3,
      title: '1m',
      active: false,
    },
    {
      id: 4,
      title: '1y',
      active: false,
    },
  ]);

  const [info, setInfo] = React.useState({
    totalStaked: '-',
    totalIssued: '-',
    allTimeMined: '-',
    boostFactor: '-',
    estimateDailyRewardsToday: '-',
    rewardPerTokenWithBoost: '-',
    rewardsPerTokenWithBoost: '-',
  } as IData);

  const { t } = useTranslation();

  const dataChart = {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    datasets: [
      {
        label: 'BTCMT',
        tension: 0.3,
        data: [12, 19, 3, 5, 2, 3, 123, 77, 44, 66, 54],
        fill: true,
        backgroundColor: 'rgba(109, 218, 192,0.1)',
        borderColor: 'rgb(109, 218, 192)',
      },
    ],
  };

  const options = {
    scales: {
      // xAxes: {
      //   display: false,
      // },
      yAxes: [
        {
          ticks: {
            display: false,
            beginAtZero: true,
          },
        },
      ],
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const getInfo = useCallback(async () => {
    const { address } = store.account;

    address ? (!store.is_contractService ? store.setContractService() : null) : null;
    const web3Contract = address ? store.contracts : ([] as any);

    if (!address) {
      const w3 = new Web3(config.provider);
      contracts.names.forEach((name: string) => {
        const contractData = contracts.params[name.toUpperCase()][contracts.type];
        web3Contract[name] = new w3.eth.Contract(contractData.abi, contractData.address);
      });
    }

    const promises = [
      // TODO: посчитать - узнать откуда брать данные
      web3Contract.Token.methods
        .totalSupply()
        .call()
        .then((value: string) => {
          clogData('totalStaked (totalStaked): ', value);
          return {
            key: 'totalStaked',
            value: normalizedValue(value),
          };
        }),
      // TODO: посчитать - узнать откуда брать данные
      web3Contract.Token.methods
        .totalSupply()
        .call()
        .then((value: string) => {
          clogData('totalIssued (totalIssued): ', value);
          return {
            key: 'totalIssued',
            value: normalizedValue(value),
          };
        }),
      web3Contract.Staking.methods
        .allTimeTotalMined()
        .call()
        .then((value: string) => {
          clogData('allTimeMined (allTimeMined): ', value);
          return {
            key: 'allTimeMined',
            value: normalizedValue(value),
          };
        }),
      // TODO: посчитать - узнать откуда брать данные
      web3Contract.Token.methods
        .totalSupply()
        .call()
        .then((value: string) => {
          clogData('boostFactor (boostFactor): ', value);
          return {
            key: 'boostFactor',
            value: normalizedValue(value),
          };
        }),
      new Promise((resolve) => {
        clogData('estimateDailyRewardsToday (estimateDailyRewardsToday): ', 50_000);
        resolve({
          key: 'estimateDailyRewardsToday',
          value: '50 000',
        });
      }),
      // TODO: посчитать - узнать правильно ли получаю данные
      await getDailyRewards()
        .then((value: number) => {
          clogData('rewardPerTokenWithBoost (rewardPerTokenWithBoost): ', value);
          return {
            key: 'rewardPerTokenWithBoost',
            value: normalizedValue(value),
          };
        })
        .catch((err: any) => clogData('rewardPerTokenWithBoost error:', err)),
      // TODO: посчитать - узнать откуда брать данные
      await getDailyRewards()
        .then((value: number) => {
          clogData('rewardsPerTokenWithBoost (rewardsPerTokenWithBoost): ', value);
          return {
            key: 'rewardsPerTokenWithBoost',
            value: normalizedValue(value),
          };
        })
        .catch((err: any) => clogData('rewardsPerTokenWithBoost error:', err)),
    ];

    const uinfo = await Promise.all(promises).then((results): IData => {
      return dataToObject(results, true, 'Stats page normilized values');
    });

    await API.get('/total/history/')
      .then((res: any) => {
        clogData('Total history: ', res);
        settData(res.data);
      })
      .catch((error: any) => {
        if (error.response)
          clogData(`Total got error status ${error.response.status}: `, error.response.data);
      });

    setInfo(uinfo);
  }, [store]);

  // Functions ------------------------------------------------

  const changeChart = (data: number) => {
    if (chartButton === data) return;

    const chartButtomsCopy = chartButtons;

    chartButtomsCopy.map((btn) => {
      if (btn.id === data) {
        btn.active = true;
      } else {
        btn.active = false;
      }
      return btn;
    });

    setChartButton(data);
    setChartButtons(chartButtomsCopy);
  };

  // On Run ------------------------------------------------

  React.useEffect(() => {
    getInfo();
  }, [getInfo, store.account.address, store]);

  // Template ------------------------------------------------

  return (
    <div className="stats">
      <div className="stats-data">
        <div className="stats-data-chart">
          <div className="stats-data-chart-head">
            <div className="stats-data-chart-head-price">
              <span className="stats-data-chart-head-price-title">Current price (BTCMT)</span>
              <div className="stats-data-chart-head-price-box">
                <span className="stats-data-chart-head-price-box-title">$255</span>
                <span className="stats-data-chart-head-price-box-change">3.2%</span>
              </div>
            </div>
            <div className="stats-data-chart-head-buttons">
              {chartButtons.map((i) => (
                <span
                  onClick={() => changeChart(i.id)}
                  role="button"
                  tabIndex={0}
                  key={nextId()}
                  onKeyDown={() => changeChart(i.id)}
                  className={cn('stats-data-chart-head-buttons-item', {
                    active: i.active,
                  })}
                >
                  {i.title}
                </span>
              ))}
            </div>
          </div>
          <div className="stats-data-chart-line">
            <Line type="line" data={dataChart} options={options} />
          </div>
        </div>
        <div className="stats-data-info">
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">Total Staked</span>
            <span className="stats-data-info-item-value">{info.totalStaked}</span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">BTCMT</span>
          </div>
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">Total issued</span>
            <span className="stats-data-info-item-value">{info.totalIssued}</span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">BTCMT</span>
          </div>
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">All time mined</span>
            <span className="stats-data-info-item-value">{info.allTimeMined}</span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">HBTC</span>
          </div>
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">Boost factor</span>
            <span className="stats-data-info-item-value">{info.boostFactor}</span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">HBTC</span>
          </div>
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">Estimated rewards today</span>
            <span className="stats-data-info-item-value">{info.estimateDailyRewardsToday}</span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">HBTC</span>
          </div>
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">Reward per token with boost</span>
            <span className="stats-data-info-item-value">{info.rewardPerTokenWithBoost}</span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">USD</span>
          </div>
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">Rewards per token with boost</span>
            <span className="stats-data-info-item-value">{info.rewardsPerTokenWithBoost}</span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">HBTC</span>
          </div>
        </div>
      </div>

      <HistoryTable
        title="HBTC reward history (total)"
        head={{
          date: `${t('page.mining.history.table.col.0')}`,
          revard: `${t('page.mining.history.table.col.1')}`,
        }}
        body={tdata}
        total={{
          title: 'Total',
          value: `${0}`,
        }}
      />
    </div>
  );
};

export default observer(Statistic);
