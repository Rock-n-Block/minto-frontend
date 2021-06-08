import React from 'react';
import ReactPaginate from 'react-paginate';
import BigNumber from 'bignumber.js/bignumber';
import { autorun } from 'mobx';

import { Procedure } from '../../components/organisms';
import { config, contracts, update_after_tx_timeout } from '../../config';
import { useStore } from '../../store';
import { IData, ITableData } from '../../types';
import { clogData, customNotify, notify } from '../../utils';

import { tableData } from './data';

import './Mining.scss';

const Mining: React.FC = () => {
  const store = useStore();

  const [miningInfo, setMiningInfo] = React.useState({} as IData);
  const [firstStart, setFirstStart] = React.useState(true);

  const [miningValue, setMiningValue] = React.useState(0);
  const [miningProgress, setMiningProgress] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(0);
  const [tdata, settData] = React.useState([] as ITableData[]);

  const PER_PAGE = 10;
  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(tdata.length / PER_PAGE);

  const getMiningInfo = async () => {
    setFirstStart(false);

    if (!store.is_contractService) store.setContractService();
    store.setDecimals(new BigNumber(10).pow(contracts.decimals).toString());

    setMiningInfo(await store.contractService.miningInfo());
    settData(tableData);
  };

  const handleChangeClaimAmount = (value: any): void => {
    setMiningValue(value);
    if (value < 0) setMiningValue(0);
    if (value > +miningInfo.availableToClaim) setMiningValue(+miningInfo.availableToClaim);
  };

  const handleButtonClaimClick = (): void => {
    setMiningProgress(true);

    store.contractService
      .withdrowAllReward()
      .then(
        (data: any) => {
          notify(
            customNotify({
              text: 'Your claim complete!',
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
        setMiningValue(0);
      });
  };

  const handleButtonClick = (): void => {
    setMiningValue(+miningInfo.availableToClaim);
  };

  const handlePageClick = ({ selected: selectedPage }: any) => {
    setCurrentPage(selectedPage);
  };

  autorun(() => {
    if (!store.account.address) return;
    if (!firstStart) return;
    getMiningInfo();
  });

  React.useEffect(() => {
    if (!store.account.address) return;
    if (!firstStart) return;
    getMiningInfo();
  });

  React.useEffect(() => {
    if (!store.account.address && config.menu.onlyForAuth) {
      store.toggleWalletMenu(true);
    }
  }, [store]);

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
            miniButtonShow={false}
            inputTitle="Amount"
            btnAllText="All available"
            btnClick={handleButtonClick}
            submitBtnText="Claim"
            inputButtonShow={false}
            btnProcessed={miningProgress}
            btnProcessedText="Processing..."
            buttonClick={handleButtonClaimClick}
            inputChange={handleChangeClaimAmount}
            inputValue={miningValue}
          />

          <div className="mining-table-wrap">
            <div className="mining-table">
              <span className="mining-table-title">History</span>
              <div className="mining-table-head mining-table-col">
                <span className="mining-table-head-item">Date</span>
                <span className="mining-table-head-item">HBTC reward</span>
                <span className="mining-table-head-item">Claim status</span>
              </div>
              <div className="mining-table-body">
                {tdata.slice(offset, offset + PER_PAGE).map((item) => (
                  <div className="mining-table-body-item mining-table-col">
                    <span className="mining-table-body-item-text">{item.date}</span>
                    <span className="mining-table-body-item-text">{item.reward}</span>
                    <span className="mining-table-body-item-text">
                      {item.status ? 'Yes' : 'No'}
                    </span>
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
            Please LogIn to see Information
          </span>
        </div>
      )}
    </div>
  );
};

export default Mining;
