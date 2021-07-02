import React, { useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import nextId from 'react-id-generator';
import axios from 'axios';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import Web3 from 'web3';

import { Calculator, HistoryTable } from '../../components/organisms';
import { chain, contracts } from '../../config';
import { useStore } from '../../store';
import { IData } from '../../types';
import { API, clogData, dataToObject, getDailyRewards, normalizedValue } from '../../utils';

import './Statistic.scss';

const Statistic: React.FC = () => {
  const store = useStore();

  const { t } = useTranslation();

  // const [tdata, settData] = React.useState({ total: '0', history: [] } as IUserHistory);
  const [tdata, settData] = React.useState([]);
  const [chartButton, setChartButton] = React.useState(0);

  const [rewardCalcValue, setRewardCalcValue] = React.useState(0);
  const [dailyReward, setDailyReward] = React.useState(0);
  const [dailyRewardUsd, setDailyRewardUsd] = React.useState(0);

  const [chartButtons, setChartButtons] = React.useState([
    {
      id: 0,
      title: '1d',
      active: true,
    },
    {
      id: 1,
      title: '1w',
      active: false,
    },
    {
      id: 2,
      title: '1m',
      active: false,
    },
    {
      id: 3,
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
      const w3 = new Web3(chain.rpc);
      contracts.names.forEach((name: string) => {
        const contractData = contracts.params[name.toUpperCase()][contracts.type];
        web3Contract[name] = new w3.eth.Contract(contractData.abi, contractData.address);
      });
    }

    const promises = [
      web3Contract.Staking.methods
        .nowTotalMined()
        .call()
        .then((value: string) => {
          clogData('totalStaked (totalStaked): ', value);
          return {
            key: 'totalStaked',
            value: normalizedValue(value),
          };
        }),
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
      await getDailyRewards()
        .then((value: number) => {
          clogData('estimateDailyRewardsToday (estimateDailyRewardsToday): ', value);
          return {
            key: 'estimateDailyRewardsToday',
            value: normalizedValue(value),
          };
        })
        .catch((err: any) => clogData('rewardPerTokenWithBoostHBTC error:', err)),
      await getDailyRewards()
        .then((value: number) => {
          clogData('rewardPerTokenWithBoostHBTC (rewardPerTokenWithBoostHBTC): ', value);
          return {
            key: 'rewardPerTokenWithBoostHBTC',
            value: normalizedValue(value / (1 * 10 ** 18)),
          };
        })
        .catch((err: any) => clogData('rewardPerTokenWithBoostHBTC error:', err)),
      await axios
        .get('https://api.coingecko.com/api/v3/simple/price?ids=huobi-btc&vs_currencies=usd')
        .then(
          (res) => {
            clogData('rewardPerTokenWithBoostUSD: ', res.data['huobi-btc'].usd);
            return {
              key: 'rewardPerTokenWithBoostUSD',
              value: res.data['huobi-btc'].usd,
            };
          },
          (err) => {
            clogData('rewardPerTokenWithBoostUSD: ', err);
            return 0;
          },
        ),
    ];

    const uinfo = await Promise.all(promises).then((results): IData => {
      return dataToObject(results, true, 'Stats page normilized values');
    });

    await API.get('/total/history/')
      .then((res: any) => {
        clogData('Total history: ', res.data);
        settData(res.data);
      })
      .catch((error: any) => {
        if (error.response)
          clogData(`Total got error status ${error.response.status}: `, error.response.data);

        settData([]);
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

  // Change amounts ------------------------------------------------

  const handleRewardCalcChange = (value: number) => {
    setRewardCalcValue(value);
    if (value < 0) setRewardCalcValue(0);

    const dReward = value <= 0 ? 0 : +info.estimateDailyRewardsToday / value;
    const dRewardUsd = dReward * +info.rewardPerTokenWithBoostUSD;

    setDailyReward(+dReward.toFixed(2));
    setDailyRewardUsd(+dRewardUsd.toFixed(2));
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
              <span className="stats-data-chart-head-price-title">
                {t('page.statistic.chart.title')} (BTCMT)
              </span>
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
                  {t(`page.statistic.chart.buttons.${i.id}`)}
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
            <span className="stats-data-info-item-title">
              {t('page.statistic.info.totalStaked')}
            </span>
            <span className="stats-data-info-item-value">{info.totalStaked}</span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">BTCMT</span>
          </div>
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">
              {t('page.statistic.info.totalStaked')}
            </span>
            <span className="stats-data-info-item-value">{info.totalIssued}</span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">BTCMT</span>
          </div>
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">
              {t('page.statistic.info.allTimeMined')}
            </span>
            <span className="stats-data-info-item-value">{info.allTimeMined}</span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">HBTC</span>
          </div>
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">
              {t('page.statistic.info.boostFactor')}
            </span>
            <span className="stats-data-info-item-value">
              {(((+info.totalStaked || 0) * 0.1) / 50000).toFixed(6)}
            </span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">HBTC</span>
          </div>
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">
              {t('page.statistic.info.estimatedRewardsToday')}
            </span>
            <span className="stats-data-info-item-value">{info.estimateDailyRewardsToday}</span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">HBTC</span>
          </div>
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">
              {t('page.statistic.info.rewardPerTokenWithBoost')}
            </span>
            <span className="stats-data-info-item-value">
              {(
                +info.rewardPerTokenWithBoostHBTC * (+info.rewardPerTokenWithBoostUSD || 0)
              ).toFixed(2)}
            </span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">USD</span>
          </div>
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">
              {t('page.statistic.info.rewardPerTokenWithBoost')}
            </span>
            <span className="stats-data-info-item-value">{info.rewardPerTokenWithBoostHBTC}</span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">HBTC</span>
          </div>
        </div>
      </div>

      <HistoryTable
        title={t('page.statistic.table.title')}
        head={{
          date: `${t('page.statistic.table.col.0')}`,
          revard: `${t('page.statistic.table.col.1')}`,
        }}
        body={tdata || []}
        total={{
          title: `${t('page.statistic.table.col.2')}`,
          value: `${0}`,
        }}
      />

      <Calculator
        title={t('page.statistic.component.calculator.title')}
        input={{
          title: `${t('page.statistic.component.calculator.input.title')} (BTCMT)`,
          value: `${rewardCalcValue}`,
          change: handleRewardCalcChange,
          placeholder: '0.0',
          type: 'number',
        }}
        info={[
          {
            title: t('page.statistic.component.calculator.estimatedDailyReward'),
            value: `${dailyReward}`,
            text: 'HBTC',
          },
          {
            title: t('page.statistic.component.calculator.estimatedDailyReward'),
            value: `${dailyRewardUsd}`,
            text: 'USD',
          },
        ]}
      />
    </div>
  );
};

export default observer(Statistic);
