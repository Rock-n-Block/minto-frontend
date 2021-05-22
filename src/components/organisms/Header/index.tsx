import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import cn from 'classnames';

import { Button } from '../../atoms';

import './Header.scss';

import LogoImg from '../../../assets/img/icons/logo.svg';
import MetamaskImg from '../../../assets/img/icons/metamask.svg';
import TokenPocketImg from '../../../assets/img/icons/token-pocket.svg';
import CrossImg from '../../../assets/img/icons/cross.svg';
import ArrowImg from '../../../assets/img/sections/header/arrow.svg';

const Header: React.FC = () => {
  const [isOpen, setOpen] = React.useState<boolean>(true);
  return (
    <header className="header">
      <div className="header__row row-lg">
        <div
          className={cn('header__wallets', {
            open: isOpen,
          })}
        >
          <div className="header__wallets-item box-f-ai-c">
            <img src={MetamaskImg} alt="metamask" className="header__wallets-item-img" />
            <span className="text-bold text-md">MetaMask</span>
          </div>
          <div className="header__wallets-item box-f-ai-c">
            <img src={TokenPocketImg} alt="metamask" className="header__wallets-item-img" />
            <span className="text-bold text-md">TokenPocket</span>
          </div>
        </div>
        <div className="header__content">
          <div className="header__box box-f box-f-ai-c box-f-jc-sb">
            <div className="header__wrapper box-f box-f-ai-c">
              <Link to="/" className="header__logo">
                <img src={LogoImg} alt="" />
              </Link>
              <div className="header__nav box-f-ai-c">
                <NavLink exact to="/" className="header__nav-item text-bold text-md text-black">
                  Main
                  <img src={ArrowImg} alt="" className="header__nav-item-img" />
                </NavLink>
                <NavLink
                  exact
                  to="/staking"
                  className="header__nav-item text-bold text-md text-black"
                >
                  Staking
                  <img src={ArrowImg} alt="" className="header__nav-item-img" />
                </NavLink>
                <NavLink
                  exact
                  to="/mining"
                  className="header__nav-item text-bold text-md text-black"
                >
                  Mining
                  <img src={ArrowImg} alt="" className="header__nav-item-img" />
                </NavLink>
                <NavLink
                  exact
                  to="/about"
                  className="header__nav-item text-bold text-md text-black"
                >
                  About us
                  <img src={ArrowImg} alt="" className="header__nav-item-img" />
                </NavLink>
              </div>
            </div>
            {isOpen ? (
              <div
                className="header__wallets-close box-f-c"
                onClick={() => setOpen(false)}
                onKeyDown={() => setOpen(false)}
                role="button"
                tabIndex={0}
              >
                <img src={CrossImg} alt="close" />
              </div>
            ) : (
              <Button className="header__wallets-open" size="sm" onClick={() => setOpen(true)}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
