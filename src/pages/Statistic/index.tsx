import React, { useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import nextId from 'react-id-generator';
import axios from 'axios';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import Web3 from 'web3';

import { Calculator, HistoryTable } from '../../components/organisms';
import { chain, contracts } from '../../config';
import { useStore } from '../../store';
import { IData } from '../../types';
import { API, clogData, dataToObject, getDailyRewards } from '../../utils';

import './Statistic.scss';

interface IChartData {
  [index: string]: IChartDataItem[];
}
interface IChartDataItem {
  x: string;
  y: number;
}

interface IChartButton {
  id: number;
  title: string;
  info: string;
  active: boolean;
}

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
      info: 'day',
      active: true,
    },
    {
      id: 1,
      title: '1w',
      info: 'week',
      active: false,
    },
    {
      id: 2,
      title: '1m',
      info: 'month',
      active: false,
    },
    {
      id: 3,
      title: '1y',
      info: 'year',
      active: false,
    },
  ] as IChartButton[]);

  const [info, setInfo] = React.useState({
    totalStaked: '-',
    totalIssued: '-',
    allTimeMined: '-',
    boostFactor: '-',
    estimateDailyRewardsToday: '-',
    rewardPerTokenWithBoost: '-',
    rewardsPerTokenWithBoost: '-',
  } as IData);

  const chart = {
    day: [
      { x: moment.utc('2021-06-01T01:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T02:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T03:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T04:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T05:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T06:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T07:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T08:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T09:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T10:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T11:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T12:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T13:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T14:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T15:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T16:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T17:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T18:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T19:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T20:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T21:00:00.508Z').format('HH:mm'), y: 0 },
      { x: moment.utc('2021-06-01T22:00:00.508Z').format('HH:mm'), y: 0 },
    ],
    week: [
      { x: moment.utc('2021-04-26T06:00:00.508Z').format('YYYY/MM/DD'), y: 0 },
      { x: moment.utc('2021-05-03T06:00:00.508Z').format('YYYY/MM/DD'), y: 0 },
      { x: moment.utc('2021-05-10T06:00:00.508Z').format('YYYY/MM/DD'), y: 0 },
      { x: moment.utc('2021-05-17T06:00:00.508Z').format('YYYY/MM/DD'), y: 0 },
      { x: moment.utc('2021-05-24T06:00:00.508Z').format('YYYY/MM/DD'), y: 0 },
      { x: moment.utc('2021-05-31T06:00:00.508Z').format('YYYY/MM/DD'), y: 0 },
      { x: moment.utc('2021-06-07T06:00:00.508Z').format('YYYY/MM/DD'), y: 0 },
    ],
    month: [
      { x: moment.utc('2021-01-01T00:00:00.508Z').format('YYYY/MM'), y: 0 },
      { x: moment.utc('2021-02-01T00:00:00.508Z').format('YYYY/MM'), y: 0 },
      { x: moment.utc('2021-03-01T00:00:00.508Z').format('YYYY/MM'), y: 0 },
      { x: moment.utc('2021-04-01T00:00:00.508Z').format('YYYY/MM'), y: 0 },
      { x: moment.utc('2021-05-01T00:00:00.508Z').format('YYYY/MM'), y: 0 },
      { x: moment.utc('2021-06-01T00:00:00.508Z').format('YYYY/MM'), y: 0 },
      { x: moment.utc('2021-07-01T00:00:00.508Z').format('YYYY/MM'), y: 0 },
    ],
    year: [
      { x: moment.utc('2020-01-01T00:00:00.508Z').format('YYYY'), y: 0 },
      { x: moment.utc('2021-01-01T00:00:00.508Z').format('YYYY'), y: 0 },
      { x: moment.utc('2022-01-01T00:00:00.508Z').format('YYYY'), y: 0 },
      { x: moment.utc('2023-01-01T00:00:00.508Z').format('YYYY'), y: 0 },
      { x: moment.utc('2024-01-01T00:00:00.508Z').format('YYYY'), y: 0 },
      { x: moment.utc('2025-01-01T00:00:00.508Z').format('YYYY'), y: 0 },
      { x: moment.utc('2026-01-01T00:00:00.508Z').format('YYYY'), y: 0 },
    ],
  } as IChartData;

  const [chartData, setChartData] = React.useState(chart.day as IChartDataItem[]);

  const [dataChart, setDataChart] = React.useState({
    labels: [],
    datasets: [
      {
        label: 'BTCMT',
        tension: 0.3,
        data: chartData,
        fill: true,
        backgroundColor: 'rgba(109, 218, 192,0.1)',
        borderColor: 'rgb(109, 218, 192)',
        radius: 5,
        borderWidth: 1,
        pointHitRadius: 5,
      },
    ],
  });

  const options = {
    parsing: {
      xAxisKey: 'x',
      yAxisKey: 'y',
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          time: { parser: 'YYYY/MM/DD HH:mm:ss' },
        },
      ],
      yAxes: [
        {
          display: true,
          ticks: {
            beginAtZero: false,
          },
          suggestedMax: 600,
          suggestedMin: 0,
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
            // value: normalizedValue(value),
            value: '-',
          };
        }),
      web3Contract.Token.methods
        .totalSupply()
        .call()
        .then((value: string) => {
          clogData('totalIssued (totalIssued): ', value);
          return {
            key: 'totalIssued',
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
      await getDailyRewards()
        .then((value: number) => {
          clogData('estimateDailyRewardsToday (estimateDailyRewardsToday): ', value);
          return {
            key: 'estimateDailyRewardsToday',
            // value: normalizedValue(value),
            value: '-',
          };
        })
        .catch((err: any) => clogData('rewardPerTokenWithBoostHBTC error:', err)),
      await getDailyRewards()
        .then((value: number) => {
          clogData('rewardPerTokenWithBoostHBTC (rewardPerTokenWithBoostHBTC): ', value);
          return {
            key: 'rewardPerTokenWithBoostHBTC',
            // value: normalizedValue(value / (1 * 10 ** 18)),
            value: '-',
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
              // value: res.data['huobi-btc'].usd,
              value: '-',
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

  const changeChart = (data: IChartButton) => {
    if (chartButton === data.id) return;

    const chartButtomsCopy = chartButtons;

    chartButtomsCopy.map((btn) => {
      btn.active = btn.id === data.id;
      return btn;
    });

    setChartButton(data.id);
    setChartButtons(chartButtomsCopy);
    setChartData(chart[data.info]);

    setDataChart({
      labels: [],
      datasets: [
        {
          label: 'BTCMT',
          tension: 0.3,
          data: chart[data.info],
          fill: true,
          backgroundColor: 'rgba(109, 218, 192,0.1)',
          borderColor: 'rgb(109, 218, 192)',
          radius: 5,
          borderWidth: 1,
          pointHitRadius: 5,
        },
      ],
    });
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
                <span className="stats-data-chart-head-price-box-title">-</span>
                <span className="stats-data-chart-head-price-box-change">-</span>
              </div>
            </div>
            <div className="stats-data-chart-head-buttons">
              {chartButtons.map((i) => (
                <span
                  onClick={() => changeChart(i)}
                  role="button"
                  tabIndex={0}
                  key={nextId()}
                  onKeyDown={() => changeChart(i)}
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
            <Line
              type="line"
              data={dataChart}
              options={options}
              // redraw
              // ref={(reference) => (chartReference = reference)}
            />
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
              {t('page.statistic.info.totalIssued')}
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
              {/* {(((+info.totalStaked || 0) * 0.1) / 50000).toFixed(6)} */}-
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
              {Number.isNaN(
                (
                  +info.rewardPerTokenWithBoostHBTC * (+info.rewardPerTokenWithBoostUSD || 0)
                ).toFixed(2),
              )
                ? (
                    +info.rewardPerTokenWithBoostHBTC * (+info.rewardPerTokenWithBoostUSD || 0)
                  ).toFixed(2)
                : '-'}
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
            value: `${dailyReward || 0}`,
            text: 'HBTC',
          },
          {
            title: t('page.statistic.component.calculator.estimatedDailyReward'),
            value: `${dailyRewardUsd || 0}`,
            text: 'USD',
          },
        ]}
      />
    </div>
  );
};

export default observer(Statistic);
