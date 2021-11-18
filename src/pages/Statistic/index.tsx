// export {};

import React, { useCallback } from 'react';
// import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
// import nextId from 'react-id-generator';
import axios from 'axios';
import BigNumber from 'bignumber.js/bignumber';
// import cn from 'classnames';
import { observer } from 'mobx-react-lite';
import Web3 from 'web3';

import { HistoryTable, Calculator } from '../../components/organisms';
import { chain, contracts } from '../../config';
import { useStore } from '../../store';
import { IData } from '../../types';
import { API, clogData, dataToObject, getDailyRewards, normalizedValue } from '../../utils';

import './Statistic.scss';

// interface IChartData {
//   [index: string]: IChartDataItem[];
// }
// interface IChartDataItem {
//   x: string;
//   y: number;
// }

// interface IChartButton {
//   id: number;
//   title: string;
//   info: string;
//   active: boolean;
// }

interface ItDataTotal {
  date: string;
  value: number;
}

const Statistic: React.FC = () => {
  const store = useStore();

  const { t } = useTranslation();

  // const [tdata, settData] = React.useState({ total: '0', history: [] } as IUserHistory);
  const [tdata, settData] = React.useState([]);
  const [tdataTotal, settDataTotal] = React.useState(0);
  // const [chartButton, setChartButton] = React.useState(0);

  const [rewardCalcValue, setRewardCalcValue] = React.useState('0');
  const [BoostFactor, setBoostFactor] = React.useState(0);

  // const [chartButtons, setChartButtons] = React.useState([
  //   {
  //     id: 0,
  //     title: '1d',
  //     info: 'day',
  //     active: true,
  //   },
  //   {
  //     id: 1,
  //     title: '1w',
  //     info: 'week',
  //     active: false,
  //   },
  //   {
  //     id: 2,
  //     title: '1m',
  //     info: 'month',
  //     active: false,
  //   },
  //   {
  //     id: 3,
  //     title: '1y',
  //     info: 'year',
  //     active: false,
  //   },
  // ] as IChartButton[]);

  const [info, setInfo] = React.useState({
    totalStaked: '-',
    totalIssued: '-',
    allTimeMined: '-',
    boostFactor: '-',
    estimateDailyRewardsToday: '-',
    rewardPerTokenWithBoost: '-',
    rewardsPerTokenWithBoost: '-',
  } as IData);

  // const chart = {
  //   day: [
  //     { x: moment.utc('2021-06-01T01:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T02:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T03:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T04:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T05:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T06:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T07:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T08:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T09:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T10:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T11:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T12:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T13:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T14:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T15:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T16:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T17:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T18:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T19:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T20:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T21:00:00.508Z').format('HH:mm'), y: 0 },
  //     { x: moment.utc('2021-06-01T22:00:00.508Z').format('HH:mm'), y: 0 },
  //   ],
  //   week: [
  //     { x: moment.utc('2021-04-26T06:00:00.508Z').format('YYYY/MM/DD'), y: 0 },
  //     { x: moment.utc('2021-05-03T06:00:00.508Z').format('YYYY/MM/DD'), y: 0 },
  //     { x: moment.utc('2021-05-10T06:00:00.508Z').format('YYYY/MM/DD'), y: 0 },
  //     { x: moment.utc('2021-05-17T06:00:00.508Z').format('YYYY/MM/DD'), y: 0 },
  //     { x: moment.utc('2021-05-24T06:00:00.508Z').format('YYYY/MM/DD'), y: 0 },
  //     { x: moment.utc('2021-05-31T06:00:00.508Z').format('YYYY/MM/DD'), y: 0 },
  //     { x: moment.utc('2021-06-07T06:00:00.508Z').format('YYYY/MM/DD'), y: 0 },
  //   ],
  //   month: [
  //     { x: moment.utc('2021-01-01T00:00:00.508Z').format('YYYY/MM'), y: 0 },
  //     { x: moment.utc('2021-02-01T00:00:00.508Z').format('YYYY/MM'), y: 0 },
  //     { x: moment.utc('2021-03-01T00:00:00.508Z').format('YYYY/MM'), y: 0 },
  //     { x: moment.utc('2021-04-01T00:00:00.508Z').format('YYYY/MM'), y: 0 },
  //     { x: moment.utc('2021-05-01T00:00:00.508Z').format('YYYY/MM'), y: 0 },
  //     { x: moment.utc('2021-06-01T00:00:00.508Z').format('YYYY/MM'), y: 0 },
  //     { x: moment.utc('2021-07-01T00:00:00.508Z').format('YYYY/MM'), y: 0 },
  //   ],
  //   year: [
  //     { x: moment.utc('2020-01-01T00:00:00.508Z').format('YYYY'), y: 0 },
  //     { x: moment.utc('2021-01-01T00:00:00.508Z').format('YYYY'), y: 0 },
  //     { x: moment.utc('2022-01-01T00:00:00.508Z').format('YYYY'), y: 0 },
  //     { x: moment.utc('2023-01-01T00:00:00.508Z').format('YYYY'), y: 0 },
  //     { x: moment.utc('2024-01-01T00:00:00.508Z').format('YYYY'), y: 0 },
  //     { x: moment.utc('2025-01-01T00:00:00.508Z').format('YYYY'), y: 0 },
  //     { x: moment.utc('2026-01-01T00:00:00.508Z').format('YYYY'), y: 0 },
  //   ],
  // } as IChartData;

  // const [chartData, setChartData] = React.useState(chart.day as IChartDataItem[]);

  // const [dataChart, setDataChart] = React.useState({
  //   labels: [],
  //   datasets: [
  //     {
  //       label: 'BTCMT',
  //       tension: 0.3,
  //       data: chartData,
  //       fill: true,
  //       backgroundColor: 'rgba(109, 218, 192,0.1)',
  //       borderColor: 'rgb(109, 218, 192)',
  //       radius: 5,
  //       borderWidth: 1,
  //       pointHitRadius: 5,
  //     },
  //   ],
  // });

  // const options = {
  //   parsing: {
  //     xAxisKey: 'x',
  //     yAxisKey: 'y',
  //   },
  //   scales: {
  //     xAxes: [
  //       {
  //         type: 'time',
  //         time: { parser: 'YYYY/MM/DD HH:mm:ss' },
  //       },
  //     ],
  //     yAxes: [
  //       {
  //         display: true,
  //         ticks: {
  //           beginAtZero: false,
  //         },
  //         suggestedMax: 600,
  //         suggestedMin: 0,
  //       },
  //     ],
  //   },
  //   plugins: {
  //     legend: {
  //       display: false,
  //     },
  //   },
  // };

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
      web3Contract.Staking.methods // BTCMT
        .nowTotalMined()
        .call()
        .then((value: string) => {
          clogData('totalStaked (totalStaked): ', value);

          const boostFactor = new BigNumber(50000)
            .div(new BigNumber(+normalizedValue(value) || 0).multipliedBy(0.01))
            .toFixed(6);

          setBoostFactor(+(+boostFactor || 0).toFixed(2));

          clogData('boostFactor (boostFactor): ', boostFactor);

          return {
            key: 'totalStaked',
            value: normalizedValue(value, true, 6),
            // value: '-',
          };
        }),
      web3Contract.Token.methods
        .totalSupply()
        .call()
        .then((value: string) => {
          clogData('totalIssued (totalIssued): ', value);
          return {
            key: 'totalIssued',
            value: normalizedValue(value, true, 6),
            // value: '-',
          };
        }),
      web3Contract.Staking.methods // HBTC
        .allTimeTotalMined()
        .call()
        .then((value: string) => {
          clogData('allTimeMined (allTimeMined): ', value);
          return {
            key: 'allTimeMined',
            value: normalizedValue(value, true, 6),
            // value: '-',
          };
        }),
      await getDailyRewards()
        .then((value: number) => {
          clogData('estimateDailyRewardsToday (estimateDailyRewardsToday): ', value);
          return {
            key: 'estimateDailyRewardsToday',
            value,
            // value: '-',
          };
        })
        .catch((err: any) => clogData('estimateDailyRewardsToday error:', err)),
      await getDailyRewards()
        .then((value: number) => {
          clogData('rewardPerTokenWithBoostHBTC (rewardPerTokenWithBoostHBTC): ', value);
          return {
            key: 'rewardPerTokenWithBoostHBTC',
            value: normalizedValue(value / (1 * 10 ** 18)),
            // value: '-',
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
              // value: '-',
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

        const data = res.data.filter((item: any) => {
          return item.value > 0;
        });

        settData(data);

        const total = res.data.reduce(
          (value: number, currentValue: ItDataTotal) => value + currentValue.value,
          0,
        );

        clogData('Total: ', total);

        settDataTotal(total);
      })
      .catch((error: any) => {
        if (error.response)
          clogData(`Total got error status ${error.response.status}: `, error.response.data);

        settData([]);
        settDataTotal(0);
      });

    setInfo(uinfo);
  }, [store]);

  // Functions ------------------------------------------------

  // const changeChart = (data: IChartButton) => {
  //   if (chartButton === data.id) return;

  //   const chartButtomsCopy = chartButtons;

  //   chartButtomsCopy.map((btn) => {
  //     btn.active = btn.id === data.id;
  //     return btn;
  //   });

  //   setChartButton(data.id);
  //   setChartButtons(chartButtomsCopy);
  //   setChartData(chart[data.info]);

  //   setDataChart({
  //     labels: [],
  //     datasets: [
  //       {
  //         label: 'BTCMT',
  //         tension: 0.3,
  //         data: chart[data.info],
  //         fill: true,
  //         backgroundColor: 'rgba(109, 218, 192,0.1)',
  //         borderColor: 'rgb(109, 218, 192)',
  //         radius: 5,
  //         borderWidth: 1,
  //         pointHitRadius: 5,
  //       },
  //     ],
  //   });
  // };

  // Change amounts ------------------------------------------------

  const handleRewardCalcChange = (value: string) => {
    setRewardCalcValue(value);
    if (+value <= 0) setRewardCalcValue('');
  };

  // On Run ------------------------------------------------

  React.useEffect(() => {
    getInfo();
  }, [getInfo, store.account.address, store]);

  const estimatedDailyReward = React.useMemo(() => {
    if (
      +rewardCalcValue &&
      new BigNumber(rewardCalcValue).isGreaterThan(0) &&
      new BigNumber(info.estimateDailyRewardsToday).isGreaterThan(0)
    ) {
      const userValue = new BigNumber(+rewardCalcValue ? rewardCalcValue : 0);

      const totalS = new BigNumber(info.totalStaked);

      const result = new BigNumber(userValue)
        .dividedBy(new BigNumber(userValue).plus(totalS))
        .multipliedBy(info.estimateDailyRewardsToday);

      return result.toFixed(8);
    }
    return 0;
  }, [info.estimateDailyRewardsToday, rewardCalcValue, info.totalStaked]);

  const estimatedDailyRewardUSD = React.useMemo(() => {
    if (
      new BigNumber(estimatedDailyReward).isGreaterThan(0) &&
      new BigNumber(info.rewardPerTokenWithBoostUSD).isGreaterThan(0)
    ) {
      const result = new BigNumber(estimatedDailyReward)
        .multipliedBy(info.rewardPerTokenWithBoostUSD)
        .toFixed(8);
      console.log(result, 'result');
      return result;
    }
    return 0;
  }, [estimatedDailyReward, info.rewardPerTokenWithBoostUSD]);

  const rewardPerTokenWithBoostHBTC = React.useMemo(() => {
    if (
      new BigNumber(info.estimateDailyRewardsToday).isGreaterThan(0) &&
      new BigNumber(BoostFactor).isGreaterThan(0)
    ) {
      const userValue = 1;
      const totalS = new BigNumber(info.totalStaked);
      const result = new BigNumber(userValue)
        .dividedBy(new BigNumber(userValue).plus(totalS))
        .multipliedBy(info.estimateDailyRewardsToday)
        .multipliedBy(BoostFactor);

      return result;
    }
    return 0;
  }, [info.estimateDailyRewardsToday, info.totalStaked, BoostFactor]);

  const rewardPerTokenWithBoostUSD = React.useMemo(() => {
    if (
      new BigNumber(rewardPerTokenWithBoostHBTC).isGreaterThan(0) &&
      new BigNumber(info.rewardPerTokenWithBoostUSD).isGreaterThan(0)
    ) {
      const result = new BigNumber(rewardPerTokenWithBoostHBTC).multipliedBy(
        info.rewardPerTokenWithBoostUSD,
      );
      console.log(result.toFixed(10), 'result');
      return result;
    }
    return 0;
  }, [rewardPerTokenWithBoostHBTC, info.rewardPerTokenWithBoostUSD]);

  // Template ------------------------------------------------

  return (
    <div className="stats">
      <div className="stats-data">
        {/* <div className="stats-data-chart">
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
        </div> */}
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
              {Number.isNaN(BoostFactor) ? '-' : BoostFactor}
            </span>
            <span className="stats-data-info-item-line" />
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
              {+rewardPerTokenWithBoostUSD ? rewardPerTokenWithBoostUSD.toFixed(10) : 0}
            </span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">USD</span>
          </div>
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">
              {t('page.statistic.info.rewardPerTokenWithBoost')}
            </span>
            <span className="stats-data-info-item-value">
              {+rewardPerTokenWithBoostHBTC ? rewardPerTokenWithBoostHBTC.toFixed(10) : 0}
            </span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">HBTC</span>
          </div>
        </div>
      </div>

      <div className="mt-50" />

      {/* {tdataTotal > 0 ? ( */}
      {tdataTotal < 0 ? (
        <HistoryTable
          title={t('page.statistic.table.title')}
          head={{
            date: `${t('page.statistic.table.col.0')}`,
            revard: `${t('page.statistic.table.col.1')}`,
          }}
          body={tdata || []}
          normalize={false}
          total={{
            title: `${t('page.statistic.table.col.2')}`,
            value: `${tdataTotal}`,
          }}
        />
      ) : (
        ''
      )}

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
            value: `${estimatedDailyReward || 0}`,
            text: 'HBTC',
          },
          {
            title: t('page.statistic.component.calculator.estimatedDailyReward'),
            value: `${estimatedDailyRewardUSD || 0}`,
            text: 'USD',
          },
        ]}
      />
    </div>
  );
};

export default observer(Statistic);
