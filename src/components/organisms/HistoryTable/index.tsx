import React from 'react';
import ReactPaginate from 'react-paginate';

import { normalizedValue } from '../../../utils';

import './HistoryTable.scss';

interface ITableHead {
  date: string;
  revard: string;
}

interface ITableBody {
  date: string;
  value: number | string;
}

interface ITable {
  title: string;
  head: ITableHead;
  body: ITableBody[];
  total?: {
    title: string;
    value: string;
  };
  normalize: boolean;
}

const HistoryTable: React.FC<ITable> = ({ title, head, body, total, normalize = true }) => {
  const [currentPage, setCurrentPage] = React.useState(0);

  const PER_PAGE = 10;
  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(body.length / PER_PAGE);

  const handlePageClick = ({ selected: selectedPage }: any) => {
    setCurrentPage(selectedPage);
  };

  return (
    <div className="history-table-wrap">
      <div className="history-table">
        <span className="history-table-title">{title}</span>
        <div className="history-table-head history-table-col">
          <span className="history-table-head-item">{head.date}</span>
          <span className="history-table-head-item">{head.revard}</span>
        </div>
        <div className="history-table-body">
          {body.slice(offset, offset + PER_PAGE).map((item, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className="history-table-body-item history-table-col">
              <span className="history-table-body-item-text">{item.date}</span>
              <span className="history-table-body-item-text">
                {normalize ? normalizedValue(item.value, true, 0) : item.value}
              </span>
            </div>
          ))}
        </div>

        {total ? (
          <div className="history-table-body">
            <div className="history-table-body-item history-table-col history-table-total">
              <span className="history-table-body-item-text">{total?.title}</span>
              <span className="history-table-body-item-text">{total?.value}</span>
            </div>
          </div>
        ) : (
          ''
        )}

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
  );
};

export default HistoryTable;
