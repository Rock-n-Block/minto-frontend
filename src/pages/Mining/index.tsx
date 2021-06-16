import React, { useCallback } from 'react';
import ReactPaginate from 'react-paginate';
import { observer } from 'mobx-react-lite';

import { Procedure } from '../../components/organisms';
import { config, update_after_tx_timeout } from '../../config';
import { useStore } from '../../store';
import { IData, ITableData } from '../../types';
import {
  API,
  clogData,
  customNotify,
  deNormalizedValue,
  errCode,
  normalizedValue,
  notify,
} from '../../utils';

import './Mining.scss';
import { useTranslation } from 'react-i18next';

const Mining: React.FC = () => {
  const store = useStore();

  const [miningInfo, setMiningInfo] = React.useState({} as IData);
  const [tdata, settData] = React.useState([] as ITableData[]);
  const [currentPage, setCurrentPage] = React.useState(0);

  const [mnValue, setMnValue] = React.useState(0);
  const [miningProgress, setMiningProgress] = React.useState(false);

  const PER_PAGE = 10;
  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(tdata.length / PER_PAGE);

  const { t } = useTranslation();

  const getMiningInfo = useCallback(async () => {
    if (!store.is_contractService) store.setContractService();

    setMiningInfo(await store.contractService.miningInfo());

    await API.post('/user/history/', {
      address: store.account.address,
    })
      .then((res: any) => {
        clogData('User history: ', res);
        settData(res.data.history);
      })
      .catch((error: any) => {
        if (error.response) {
          if (error.response.status === 500) notify(`Cant't load history.`, 'error');
          if (error.response.status === 404) {
            notify(`User history not found.`, 'warning');
          }
          clogData(`User history got error status ${error.response.status}: `, error.response.data);
        }
      });
  }, [store]);

  // Change amounts ------------------------------------------------

  const handleChangeClaimAmount = (value: any): void => {
    setMnValue(value);
    if (value < 0) setMnValue(0);
    if (value > +miningInfo.availableToClaim) setMnValue(+miningInfo.availableToClaim);
  };

  // Send Max ------------------------------------------------

  const handleButtonClick = (): void => {
    setMnValue(+miningInfo.availableToClaim);
  };

  // Send Tx ------------------------------------------------

  const handleButtonClaimClick = (): void => {
    if (+mnValue === 0 && +mnValue <= 0) {
      notify(`${t('notifications.claim.inputError')}`, 'error');
      return;
    }

    notify(
      customNotify({
        translate: {
          key: 'notifications.claim.warning',
          data: {
            token: 'HBTC',
            mnValue,
          },
        },
        text: `Attention! You will get: ${mnValue} HBTC.`,
      }),
      'warning',
    );

    setMiningProgress(true);
    if (mnValue === +miningInfo.availableToClaim) {
      store.contractService
        .claimAllReward()
        .then(
          (data: any) => {
            notify(
              customNotify({
                translate: {
                  key: 'notifications.claim.complete',
                  data: {
                    token: 'HBTC',
                    value: +miningInfo.availableToClaim,
                  },
                },
                text: `Your Claim ${+miningInfo.availableToClaim} HBTC complete!`,
                link: {
                  url: `${config.tx.link}/${data[1]}`,
                  text: `${t('notifications.claim.link')}`,
                },
              }),
              'success',
            );

            setTimeout(() => {
              getMiningInfo();
            }, update_after_tx_timeout);
          },
          (err: any) => clogData('claim err: ', err),
        )
        .finally(() => {
          setMiningProgress(false);
          setMnValue(0);
        });

      return;
    }

    const amount = deNormalizedValue(mnValue);

    store.contractService
      .claimReward(amount)
      .then(
        (data: any) => {
          notify(
            customNotify({
              translate: {
                key: 'notifications.claim.complete',
                data: {
                  token: 'HBTC',
                  value: mnValue,
                },
              },
              text: `Your Claim ${mnValue} HBTC complete!`,
              link: {
                url: `${config.tx.link}/${data[1]}`,
                text: `${t('notifications.claim.link')}`,
              },
            }),
            'success',
          );
          setTimeout(() => {
            getMiningInfo();
          }, update_after_tx_timeout);
        },
        (err: any) => {
          clogData('claim err: ', err);
          notify(`${t('notifications.error.text')} ${errCode(err.code)}`, 'error');
        },
      )
      .finally(() => {
        setMiningProgress(false);
        setMnValue(0);
      });
  };

  // Functions ------------------------------------------------

  const handlePageClick = ({ selected: selectedPage }: any) => {
    setCurrentPage(selectedPage);
  };

  // On Run ------------------------------------------------

  React.useEffect(() => {
    if (!store.account.address && config.menu.onlyForAuth) {
      store.toggleWalletMenu(true);
    }
    if (!store.account.address) return;
    getMiningInfo();
  }, [getMiningInfo, store.account.address, store]);

  // Template ------------------------------------------------

  return (
    <div className="mining">
      {store.account.address ? (
        <div>
          <Procedure
            title={t('page.mining.title')}
            info={[
              {
                title: `${t('page.mining.text.left')}`,
                value: `${miningInfo.th} TH/s`,
              },
              {
                title: `${t('page.mining.text.right')}`,
                value: `${miningInfo.availableToClaim} HBTC`,
              },
            ]}
            miniButtonShow
            inputTitle={t('page.mining.textButton')}
            btnAllText={t('page.mining.button')}
            btnClick={handleButtonClick}
            submitBtnText={t('page.mining.button2')}
            btnProcessed={miningProgress}
            btnProcessedText={t('button.processing')}
            buttonClick={handleButtonClaimClick}
            inputChange={handleChangeClaimAmount}
            inputValue={mnValue}
          />

          <div className="mining-table-wrap">
            <div className="mining-table">
              {/* <span className="mining-table-title">History</span> */}
              <span className="mining-table-title">{t('page.mining.history.title')}</span>
              <div className="mining-table-head mining-table-col">
                <span className="mining-table-head-item">
                  {t('page.mining.history.table.col.0')}
                </span>
                <span className="mining-table-head-item">
                  {t('page.mining.history.table.col.1')}
                </span>
                {/* <span className="mining-table-head-item">Claim status</span> */}
              </div>
              <div className="mining-table-body">
                {tdata.slice(offset, offset + PER_PAGE).map((item, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={index} className="mining-table-body-item mining-table-col">
                    <span className="mining-table-body-item-text">{item.date}</span>
                    <span className="mining-table-body-item-text">
                      {normalizedValue(item.value, 0)}
                    </span>
                    {/* <span className="mining-table-body-item-text">
                      {item.status ? 'Yes' : 'No'}
                    </span> */}
                  </div>
                ))}
              </div>
              <ReactPaginate
                previousLabel="<"
                nextLabel=">"
                pageCount={pageCount}
                onPageChange={handlePageClick}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                containerClassName="pagination"
                pageLinkClassName="pagination-link"
                previousLinkClassName="pagination-link-prev"
                nextLinkClassName="pagination-link-next"
                disabledClassName="pagination-link-disabled"
                activeClassName="pagination-link-active"
              />
            </div>
          </div>
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

export default observer(Mining);
