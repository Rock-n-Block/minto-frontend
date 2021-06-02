import React from 'react';
import { Link } from 'react-router-dom';

import Logo from '../../../assets/img/icons/logo.svg';
import Github from '../../../assets/img/sections/footer/github.svg';
import Medium from '../../../assets/img/sections/footer/medium.svg';
import Telegram from '../../../assets/img/sections/footer/telegram.svg';
import Twitter from '../../../assets/img/sections/footer/twitter.svg';

import './Footer.scss';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="row">
        <Link to="/#">
          <img src={Logo} alt="logo" />
        </Link>
        <nav className="footer__navigation-container">
          <ul className="footer__navigation">
            <li className="footer__navigation-item">
              <Link to="/about" className="text-black text-smd text-liga-off">
                About
              </Link>
            </li>
            <li className="footer__navigation-item">
              <Link to="/staking" className="text-black text-smd text-liga-off">
                Stake BTCMT
              </Link>
            </li>
            <li className="footer__navigation-item">
              <Link to="/about#contacts" className="text-black text-smd text-liga-off">
                Contacts
              </Link>
            </li>
          </ul>
        </nav>
        <div className="footer__socials">
          <div className="footer__divider"> </div>
          <ul className="footer__socials-list">
            <li className="footer__socials-item">
              <a href="/#" className="footer__social circle">
                <img src={Twitter} alt="twitter" />
              </a>
            </li>
            <li className="footer__socials-item">
              <a href="/#" className="footer__social circle">
                <img src={Medium} alt="medium" />
              </a>
            </li>
            <li className="footer__socials-item">
              <a href="/#" className="footer__social circle">
                <img src={Telegram} alt="telegram" />
              </a>
            </li>
            <li className="footer__socials-item">
              <a href="/#" className="footer__social circle">
                <img src={Github} alt="github" />
              </a>
            </li>
          </ul>
          <div className="footer__divider" />
        </div>
        <div className="footer__copyrights text-liga-off">© 2021 Minto. All rights reserved</div>
      </div>
    </footer>
  );
};

export default Footer;
