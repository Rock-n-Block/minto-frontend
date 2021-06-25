import React from 'react';
import { useTranslation } from 'react-i18next';

import Facebook from '../../../assets/img/icons/facebook-white.svg';
import Logo from '../../../assets/img/icons/logo.svg';
import Telegram from '../../../assets/img/sections/footer/telegram.svg';
import Twitter from '../../../assets/img/sections/footer/twitter.svg';

import './Footer.scss';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="row">
        <span>
          <img src={Logo} alt="logo" />
        </span>
        <nav className="footer__navigation-container">
          <ul className="footer__navigation">
            <li className="footer__navigation-item">
              <span className="text-black text-smd text-liga-off">{t('footer.menu.about')}</span>
            </li>
            <li className="footer__navigation-item">
              <span className="text-black text-smd text-liga-off">{t('footer.menu.staking')}</span>
            </li>
            <li className="footer__navigation-item">
              <span className="text-black text-smd text-liga-off">{t('footer.menu.contacts')}</span>
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
                href="https://t.me/btcmtofficial"
                target="_blank"
                className="footer__social circle"
                rel="noreferrer"
              >
                <img src={Telegram} alt="telegram" />
              </a>
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
