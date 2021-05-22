import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import cn from 'classnames';

import { Button } from '../../atoms';

import './Header.scss';

import LogoImg from '../../../assets/img/icons/logo.svg';
import NavOpenImg from '../../../assets/img/icons/nav-open.svg';
import MetamaskImg from '../../../assets/img/icons/metamask.svg';
import TokenPocketImg from '../../../assets/img/icons/token-pocket.svg';
import CrossImg from '../../../assets/img/icons/cross.svg';
import ArrowImg from '../../../assets/img/sections/header/arrow.svg';

const Header: React.FC = () => {
  const [isWalletsMenuOpen, setWalletsMenuOpen] = React.useState<boolean>(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);

  const handleHeaderClick = (): void => {
    if (window.innerWidth < 768 && (isWalletsMenuOpen || isMobileMenuOpen)) {
      setMobileMenuOpen(false);
      setWalletsMenuOpen(false);
    }
  };
  return (
    <header
      className={cn('header', {
        open: isWalletsMenuOpen || isMobileMenuOpen,
      })}
      onClick={handleHeaderClick}
      onKeyDown={handleHeaderClick}
      role="button"
      tabIndex={0}
    >
      <div className="header__row row-lg">
        <div
          className={cn('header__wallets hidden-mobile', {
            open: isWalletsMenuOpen,
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
        <div className="header__content box-f box-f-ai-c box-f-jc-sb hidden-desktop">
          <div className="header__wrapper">
            {!isMobileMenuOpen && !isWalletsMenuOpen ? (
              <div
                className="header__nav-open"
                onClick={() => setMobileMenuOpen(true)}
                onKeyDown={() => setMobileMenuOpen(true)}
                role="button"
                tabIndex={0}
              >
                <img src={NavOpenImg} alt="open" />
              </div>
            ) : (
              <div
                className="header__nav-open"
                onClick={() => {
                  if (isMobileMenuOpen) {
                    setMobileMenuOpen(false);
                  } else {
                    setWalletsMenuOpen(false);
                  }
                }}
                onKeyDown={() => {
                  if (isMobileMenuOpen) {
                    setMobileMenuOpen(false);
                  } else {
                    setWalletsMenuOpen(false);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <img src={CrossImg} alt="open" />
              </div>
            )}
            <Link to="/" className="header__logo">
              <img src={LogoImg} alt="" />
            </Link>
          </div>

          <div
            className={cn('header__wallets', {
              open: isWalletsMenuOpen,
            })}
          >
            <div className="header__wallets-item box-f-c">
              <img src={MetamaskImg} alt="metamask" className="header__wallets-item-img" />
              <span className="text-bold text-lmd">MetaMask</span>
            </div>
            <div className="header__wallets-item box-f-c">
              <img src={TokenPocketImg} alt="metamask" className="header__wallets-item-img" />
              <span className="text-bold text-lmd">TokenPocket</span>
            </div>
          </div>
          <div
            className={cn('header__menu', {
              open: isMobileMenuOpen,
            })}
          >
            <Button
              className="header__menu-btn"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(false);
                setWalletsMenuOpen(true);
              }}
            >
              Connect Wallet
            </Button>
            <div className="header__menu-nav">
              <NavLink exact to="/" className="header__menu-nav-item text-bold text-slg text-black">
                Main
              </NavLink>
              <NavLink
                exact
                to="/staking"
                className="header__menu-nav-item text-bold text-slg text-black"
              >
                Staking
              </NavLink>
              <NavLink
                exact
                to="/mining"
                className="header__menu-nav-item text-bold text-slg text-black"
              >
                Mining
              </NavLink>
              <NavLink
                exact
                to="/about"
                className="header__menu-nav-item text-bold text-slg text-black"
              >
                About us
              </NavLink>
            </div>
          </div>
        </div>
        <div className="header__content box-f box-f-ai-c box-f-jc-sb hidden-mobile">
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
              <NavLink exact to="/mining" className="header__nav-item text-bold text-md text-black">
                Mining
                <img src={ArrowImg} alt="" className="header__nav-item-img" />
              </NavLink>
              <NavLink exact to="/about" className="header__nav-item text-bold text-md text-black">
                About us
                <img src={ArrowImg} alt="" className="header__nav-item-img" />
              </NavLink>
            </div>
          </div>
          {isWalletsMenuOpen ? (
            <div
              className="header__wallets-close box-f-c"
              onClick={() => setWalletsMenuOpen(false)}
              onKeyDown={() => setWalletsMenuOpen(false)}
              role="button"
              tabIndex={0}
            >
              <img src={CrossImg} alt="close" />
            </div>
          ) : (
            <Button
              className="header__wallets-open"
              size="sm"
              onClick={() => setWalletsMenuOpen(true)}
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
