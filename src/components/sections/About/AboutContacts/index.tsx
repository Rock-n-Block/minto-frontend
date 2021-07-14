import React from 'react';
import { useTranslation } from 'react-i18next';

import Facebook from '../../../../assets/img/icons/facebook-white.svg';
import { ReactComponent as IconMail } from '../../../../assets/img/icons/mail-open.svg';
// import Github from '../../../../assets/img/sections/footer/github.svg';
import Medium from '../../../../assets/img/sections/footer/medium.svg';
import Telegram from '../../../../assets/img/sections/footer/telegram.svg';
import Twitter from '../../../../assets/img/sections/footer/twitter.svg';
import WeChat from '../../../../assets/img/sections/footer/weChat.svg';
import { Button } from '../../../atoms';
import { ModalQR } from '../../../organisms';

import './AboutContacts.scss';

const AboutContacts: React.FC = () => {
  const [modalQr, setModalQr] = React.useState(false);
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const showModalQR = () => {
    setModalQr(true);
  };

  return (
    <div id="contacts" className="about-contacts">
      {modalQr ? <ModalQR showModal={modalQr} closeModal={setModalQr} /> : ''}
      <div className="row">
        <h2 className="h2 text-bold">Contacts</h2>
        <div className="about-contacts__links">
          <a
            href="https://twitter.com/btcmtofficial"
            target="_blank"
            rel="noreferrer"
            className="about-contacts__links-item circle"
          >
            <img src={Twitter} alt="twitter" />
          </a>
          <a
            href="https://twitter.com/btcmtofficial"
            target="_blank"
            rel="noreferrer"
            className="about-contacts__links-item circle"
          >
            <img src={Facebook} alt="facebook" />
          </a>
          <a
            href="https://twitter.com/btcmtofficial"
            target="_blank"
            rel="noreferrer"
            className="about-contacts__links-item circle"
          >
            <img src={Medium} alt="medium" />
          </a>
          {lang === 'en' ? (
            <a
              href="https://t.me/btcmtofficial"
              target="_blank"
              className="about-contacts__links-item circle"
              rel="noreferrer"
            >
              <img src={Telegram} alt="Telegram" />
            </a>
          ) : (
            <button
              onClick={() => showModalQR()}
              type="button"
              className="about-contacts__links-item circle"
            >
              <img src={WeChat} alt="WeChat" />
            </button>
          )}
        </div>
        {/* <div className="about-contacts__countries">
          <div className="about-contacts__country">
            <h3 className="about-contacts__country-name text text-bold ">United Kingdom</h3>
            <ul className="about-contacts__country-description country-description">
              <li className=" country-description__item">Miotech Impex LP</li>
              <li className=" country-description__item">Company number: SL31818</li>
              <li className=" country-description__item">39/5 Granton Crescent</li>
              <li className=" country-description__item">Edinburgh</li>
              <li className=" country-description__item">United Kingdom, EH5 1BN</li>
            </ul>
          </div>
          <div className="about-contacts__country">
            <h3 className="about-contacts__country-name text text-bold ">Estonia</h3>
            <ul className="about-contacts__country-description country-description">
              <li className=" country-description__item">CryptoUniverse OÜ</li>
              <li className=" country-description__item">Company number: 14423879</li>
              <li className=" country-description__item">Roseni tn 13 Kesklinna linnaosa,</li>
              <li className=" country-description__item">Tallinn, Estonia, 10111</li>
            </ul>
          </div>
        </div> */}
        <Button
          className="about-contacts__support-btn"
          outLink
          colorScheme="white"
          link="mailto:info@minto.finance"
        >
          <IconMail className="btn-icon" />
          info@minto.finance
        </Button>
      </div>
    </div>
  );
};

export default AboutContacts;
