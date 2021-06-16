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
  normalizedValue,
  notify,
} from '../../utils';

import './Mining.scss';

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
      notify('Please, input value in claim field.', 'error');
      return;
    }

    notify(`Attention! You will get: ${mnValue} HBTC.`, 'warning');

    setMiningProgress(true);
    if (mnValue === +miningInfo.availableToClaim) {
      store.contractService
        .claimAllReward()
        .then(
          (data: any) => {
            notify(
              customNotify({
                text: `Your Claim ${+miningInfo.availableToClaim} HBTC complete!`,
                link: {
                  url: `${config.tx.link}/${data[1]}`,
                  text: 'View tx',
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
              text: `Your Claim ${mnValue} HBTC complete!`,
              link: {
                url: `${config.tx.link}/${data[1]}`,
                text: 'View tx',
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
            title="Mining"
            info={[
              {
                title: 'Your mining power equivalent',
                value: `${miningInfo.th} TH/s`,
              },
              {
                title: 'Available to claim',
                value: `${miningInfo.availableToClaim} HBTC`,
              },
            ]}
            miniButtonShow
            inputTitle="Amount"
            btnAllText="All available"
            btnClick={handleButtonClick}
            submitBtnText="Claim"
            btnProcessed={miningProgress}
            btnProcessedText="Processing..."
            buttonClick={handleButtonClaimClick}
            inputChange={handleChangeClaimAmount}
            inputValue={mnValue}
          />

          <div className="mining-table-wrap">
            <div className="mining-table">
              <span className="mining-table-title">History</span>
              <div className="mining-table-head mining-table-col">
                <span className="mining-table-head-item">Date</span>
                <span className="mining-table-head-item">HBTC reward</span>
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
            Please Connect Wallet to see Information.
          </span>
        </div>
      )}
    </div>
  );
};

export default observer(Mining);
