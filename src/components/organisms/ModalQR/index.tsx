import React from 'react';

import Close from '../../../assets/img/icons/modal-times.svg';
import QRcode from '../../../assets/img/qrCode.svg';

import './ModalQR.scss';

export interface IModal {
  showModal: boolean;
  closeModal: (value: boolean) => void;
}

const ModalQR: React.FC<IModal> = ({ showModal, closeModal }) => {
  const onCloseModal = (event: React.MouseEvent) => {
    if ((event.target as HTMLDataElement).dataset.close) {
      closeModal(false);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if ((event.target as HTMLDataElement).dataset.close) {
      closeModal(false);
    }
  };
  const cmp = (
    <div
      className="modal"
      onClick={(event) => onCloseModal(event)}
      onKeyDown={(event) => onKeyDown(event)}
      role="presentation"
    >
      <div className="modal__body" data-close="true">
        <div className="modal__body-items">
          <img src={Close} alt="close" className="modal__body-items-close" data-close="true" />
          <h2>Please scan this QR code to join our WeChat community</h2>
          <img src={QRcode} alt="QR code" className="modal__body-items-qrcode" />
        </div>
      </div>
    </div>
  );

  return <>{showModal ? cmp : null}</>;
};

export default ModalQR;
