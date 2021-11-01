import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Facebook from '../../../assets/img/icons/facebook-white.svg';
import Logo from '../../../assets/img/icons/logo.svg';
/* import Github from '../../../assets/img/sections/footer/github.svg'; */
import Medium from '../../../assets/img/sections/footer/medium.svg';
import Telegram from '../../../assets/img/sections/footer/telegram.svg';
import Twitter from '../../../assets/img/sections/footer/twitter.svg';
import WeChat from '../../../assets/img/sections/footer/weChat.svg';
import { ModalQR } from '..';

import './Footer.scss';

const Footer: React.FC = () => {
  const [modalQr, setModalQr] = React.useState(false);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const showModalQR = () => {
    setModalQr(true);
  };
  return (
    <footer className="footer">
      {modalQr ? <ModalQR showModal={modalQr} closeModal={setModalQr} /> : ''}
      <div className="row">
        <span>
          <img src={Logo} alt="logo" />
        </span>
        <nav className="footer__navigation-container">
          <ul className="footer__navigation">
            <li className="footer__navigation-item">
              <Link to="/about" className="text-black text-smd text-liga-off">
                {t('footer.menu.about')}
              </Link>
            </li>
            <li className="footer__navigation-item">
              <Link to="/staking" className="text-black text-smd text-liga-off">
                {t('footer.menu.staking')}
              </Link>
            </li>
            <li className="footer__navigation-item">
              <Link to="/about#contacts" className="text-black text-smd text-liga-off">
                {t('footer.menu.contacts')}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="footer__socials">
          <div className="footer__divider"> </div>
          <ul className="footer__socials-list">
            <li className="footer__socials-item">
              <a
                href="https://twitter.com/btcmtofficial"
                target="_blank"
                className="footer__social circle"
                rel="noreferrer"
              >
                <img src={Twitter} alt="twitter" />
              </a>
            </li>
            <li className="footer__socials-item">
              <a
                href="https://www.facebook.com/btcmtofficial"
                target="_blank"
                className="footer__social circle"
                rel="noreferrer"
              >
                <img src={Facebook} alt="facebook" />
              </a>
            </li>
            <li className="footer__socials-item">
              <a
                href="https://medium.com/@btcmtofficial"
                target="_blank"
                className="footer__social circle"
                rel="noreferrer"
              >
                <img src={Medium} alt="medium" />
              </a>
            </li>
            {/* <li className="footer__socials-item">
              <a href="/#" target="_blank" className="footer__social circle">
                <img src={Github} alt="github" />
              </a>
            </li> */}
            <li className="footer__socials-item">
              {lang === 'en' ? (
                <a
                  href="https://t.me/btcmtofficial"
                  target="_blank"
                  className="footer__social circle"
                  rel="noreferrer"
                >
                  <img src={Telegram} alt="Telegram" />
                </a>
              ) : (
                <button
                  onClick={() => showModalQR()}
                  type="button"
                  className="footer__social circle"
                >
                  <img src={WeChat} alt="WeChat" />
                </button>
              )}
            </li>
          </ul>
          <div className="footer__divider" />
        </div>
        <div className="footer__copyrights text-liga-off">{t('footer.copyright')}</div>
      </div>
    </footer>
  );
};

export default Footer;
