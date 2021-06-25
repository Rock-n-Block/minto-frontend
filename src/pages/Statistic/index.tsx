import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import nextId from 'react-id-generator';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';

import { HistoryTable } from '../../components/organisms';
import { config } from '../../config';
import { useStore } from '../../store';
import { IData, IUserHistory } from '../../types';
import { API, clogData, notify } from '../../utils';

import './Statistic.scss';

const Statistic: React.FC = () => {
  const store = useStore();

  const [info, setInfo] = React.useState({} as IData);
  const [tdata, settData] = React.useState({ total: '0', history: [] } as IUserHistory);
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

  const { t } = useTranslation();

  const getInfo = useCallback(async () => {
    if (!store.is_contractService) store.setContractService();

    // setInfo(await store.contractService.miningInfo());

    await API.post('/user/history/', {
      address: store.account.address,
    })
      .then((res: any) => {
        clogData('User history: ', res);
        settData(res.data);
      })
      .catch((error: any) => {
        if (error.response) {
          if (error.response.status === 500) notify(`Cant't load history.`, 'error');
          if (error.response.status === 404) {
            notify(`History not found.`, 'warning');
          }
          clogData(`History got error status ${error.response.status}: `, error.response.data);
        }
      });

    setInfo({ test: 0 });
    clogData('Info: ', info);
  }, [store, info]);

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

  // TODO: FIX requests
  React.useEffect(() => {
    if (!store.account.address && config.menu.onlyForAuth) {
      store.toggleWalletMenu(true);
      return;
    }
    if (!store.account.address) return;
    getInfo();
  }, [getInfo, store]);

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
        </div>
        <div className="stats-data-info">
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">Total Staked</span>
            <span className="stats-data-info-item-value">6.1M</span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">BTCMT</span>
          </div>
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">Total issued</span>
            <span className="stats-data-info-item-value">2,8 M</span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">BTCMT</span>
          </div>
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">All time mined</span>
            <span className="stats-data-info-item-value">6.1M</span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">HBTC</span>
          </div>
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">Boost factor</span>
            <span className="stats-data-info-item-value">0.5</span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">HBTC</span>
          </div>
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">Estimated rewards today</span>
            <span className="stats-data-info-item-value">50 000</span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">HBTC</span>
          </div>
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">Reward per token with boost</span>
            <span className="stats-data-info-item-value">34 M</span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">USD</span>
          </div>
          <div className="stats-data-info-item">
            <span className="stats-data-info-item-title">Rewards per token with boost</span>
            <span className="stats-data-info-item-value">32423</span>
            <span className="stats-data-info-item-line" />
            <span className="stats-data-info-item-subtitle">HBTC</span>
          </div>
        </div>
      </div>
      {store.account.address ? (
        <div>
          <HistoryTable
            title="HBTC reward history (total)"
            head={{
              date: `${t('page.mining.history.table.col.0')}`,
              revard: `${t('page.mining.history.table.col.1')}`,
            }}
            body={tdata.history}
            total={{
              title: 'Total',
              value: `${0}`,
            }}
          />
        </div>
      ) : (
        <div className="no_login_data">
          <span className="links__title text-center text text-black text-bold-e">
            {t('info.connectWallet')}
          </span>
        </div>
      )}
    </div>
  );
};

export default observer(Statistic);
