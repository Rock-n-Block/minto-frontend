import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';

import ArrowDownWhiteImg from '../../../assets/img/icons/arrow-down-white.svg';
import CrossImg from '../../../assets/img/icons/cross.svg';
import LogoImg from '../../../assets/img/icons/logo.svg';
import MetamaskImg from '../../../assets/img/icons/metamask.svg';
import NavOpenImg from '../../../assets/img/icons/nav-open.svg';
import SignOutImg from '../../../assets/img/icons/sign-out.svg';
import TokenPocketImg from '../../../assets/img/icons/token-pocket.svg';
import UserImg from '../../../assets/img/icons/user-account.svg';
import ArrowImg from '../../../assets/img/sections/header/arrow.svg';
import { WalletConnect } from '../../../services/walletconnect';
import { useStore } from '../../../store';
import { clogData } from '../../../utils';
import { Button } from '../../atoms';

import './Header.scss';
import { useTranslation } from 'react-i18next';
import nextId from 'react-id-generator';

const connect = new WalletConnect();

const Header: React.FC = observer(() => {
  const [isWalletsMenuOpen, setWalletsMenuOpen] = React.useState<boolean>(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);
  const [langToggle, setLangToggle] = React.useState<boolean>(false);
  const [langList, setLangList] = React.useState([
    {
      lng: 'en',
      title: 'Eng',
      active: true,
    },
    {
      lng: 'ch',
      title: 'Ch',
      active: false,
    },
  ]);

  const store = useStore();
  const { menu, toggleWalletMenu } = store;

  const { t, i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);

    const langListCopy = langList;

    langListCopy.map((lang) => {
      if (lang.lng === language) {
        lang.active = true;
      } else {
        lang.active = false;
      }
      return lang;
    });

    langListCopy.sort((a, b) => {
      return b.active ? 1 : -1;
    });

    setLangList(langListCopy);
  };

  const handleHeaderClick = (): void => {
    if (window.innerWidth < 768 && (isWalletsMenuOpen || isMobileMenuOpen || menu.walletsOpen)) {
      setMobileMenuOpen(false);
      setWalletsMenuOpen(false);
      toggleWalletMenu(false);
    }
  };

  const handleToggleLanguage = (): void => {
    setLangToggle(!langToggle);
  };

  const handleLogOutClick = (): void => {
    store.updateAccount({ address: undefined, balance: '0' });
    connect.logOut();
    window.location.reload();
  };

  const handleWalletClick = (name: string): void => {
    connect.initWalletConnect(name).then((is_connected: boolean) => {
      if (is_connected) {
        toggleWalletMenu(false);
        connect.getAccount(store.account).then((account: any) => {
          connect
            .getTokenBalance(account.address)
            .then((value: any) => {
              account.balance = value;
            })
            .finally(() => {
              clogData('user account: ', account);
              store.updateAccount(account);
              setMobileMenuOpen(false);
              setWalletsMenuOpen(false);
              toggleWalletMenu(false);
            });

          store.addContract('Staking', connect.getContract('Staking'));
          store.addContract('Token', connect.getContract('Token'));
          store.setWeb3(connect.Web3);
        });
      }
    });
  };

  return (
    <header
      className={cn('header', {
        open: isWalletsMenuOpen || isMobileMenuOpen || menu.walletsOpen,
      })}
      onClick={handleHeaderClick}
      onKeyDown={handleHeaderClick}
      role="button"
      tabIndex={0}
    >
      <div className="header__row row-lg">
        {!store.account.address ? (
          <div
            className={cn('header__wallets hidden-mobile', {
              open: isWalletsMenuOpen || menu.walletsOpen,
            })}
          >
            <div
              className="header__wallets-item box-f-ai-c"
              onClick={() => handleWalletClick('MetaMask')}
              onKeyDown={() => handleWalletClick('MetaMask')}
              role="button"
              tabIndex={0}
            >
              <img src={MetamaskImg} alt="metamask" className="header__wallets-item-img" />
              <span className="text-bold text-md">MetaMask</span>
            </div>
            <div
              className="header__wallets-item box-f-ai-c"
              onClick={() => handleWalletClick('WalletConnect')}
              onKeyDown={() => handleWalletClick('WalletConnect')}
              role="button"
              tabIndex={0}
            >
              <img src={TokenPocketImg} alt="metamask" className="header__wallets-item-img" />
              <span className="text-bold text-md">TokenPocket</span>
            </div>
          </div>
        ) : (
          <div
            className={cn('header__wallets hidden-mobile', {
              open: isWalletsMenuOpen || menu.walletsOpen,
            })}
          >
            <div
              className="header__wallets-item box-f-ai-c"
              onClick={() => handleLogOutClick()}
              onKeyDown={() => handleLogOutClick()}
              role="button"
              tabIndex={0}
            >
              <img src={SignOutImg} alt="metamask" className="header__wallets-item-img" />
              <span className="text-bold text-md">{t('header.menu.logout')}</span>
            </div>
          </div>
        )}

        {/* Mobile */}

        <div className="header__content box-f box-f-ai-c box-f-jc-sb hidden-desktop">
          <div className="header__wrapper">
            {!isMobileMenuOpen && !isWalletsMenuOpen && !menu.walletsOpen ? (
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
                    toggleWalletMenu(false);
                  } else {
                    setWalletsMenuOpen(false);
                    toggleWalletMenu(false);
                  }
                }}
                onKeyDown={() => {
                  if (isMobileMenuOpen) {
                    setMobileMenuOpen(false);
                  } else {
                    setWalletsMenuOpen(false);
                    toggleWalletMenu(false);
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

            {/* Mobile: Translation Buttons */}

            <div className="language-wrap">
              <div className="language-select">
                <ul
                  role="presentation"
                  className={cn('language-select-list', {
                    opened: langToggle,
                  })}
                  onKeyDown={() => handleToggleLanguage()}
                  onClick={() => handleToggleLanguage()}
                >
                  {langList.map((item) => (
                    <li
                      role="presentation"
                      key={nextId()}
                      onClick={() => changeLanguage(item.lng)}
                      onKeyDown={() => changeLanguage(item.lng)}
                      className={cn({
                        active: item.active,
                      })}
                    >
                      <span>{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {!store.account.address ? (
            <div
              className={cn('header__wallets', {
                open: isWalletsMenuOpen || menu.walletsOpen,
              })}
            >
              <div
                className="header__wallets-item box-f-c"
                onClick={() => handleWalletClick('MetaMask')}
                onKeyDown={() => handleWalletClick('MetaMask')}
                role="button"
                tabIndex={0}
              >
                <img src={MetamaskImg} alt="metamask" className="header__wallets-item-img" />
                <span className="text-bold text-lmd">MetaMask</span>
              </div>
              <div
                className="header__wallets-item box-f-c"
                onClick={() => handleWalletClick('WalletConnect')}
                onKeyDown={() => handleWalletClick('WalletConnect')}
                role="button"
                tabIndex={0}
              >
                <img src={TokenPocketImg} alt="metamask" className="header__wallets-item-img" />
                <span className="text-bold text-lmd">TokenPocket</span>
              </div>
            </div>
          ) : (
            <div
              className={cn('header__wallets', {
                open: isWalletsMenuOpen || menu.walletsOpen,
              })}
            >
              <div
                className="header__wallets-item box-f-c"
                onClick={() => {
                  handleLogOutClick();
                }}
                onKeyDown={() => {
                  handleLogOutClick();
                }}
                role="button"
                tabIndex={0}
              >
                <img src={SignOutImg} alt="metamask" className="header__wallets-item-img" />
                <span className="text-bold text-lmd">{t('header.menu.logout')}</span>
              </div>
            </div>
          )}
          <div
            className={cn('header__menu', {
              open: isMobileMenuOpen,
            })}
          >
            {store.account.address ? (
              <Button
                className="header__menu-btn"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(false);
                  setWalletsMenuOpen(true);
                  toggleWalletMenu(true);
                }}
              >
                <img src={UserImg} className="header__account-logo" alt="account" />
                {`${store.account.address.substring(0, 4)}...${store.account.address.slice(
                  store.account.address.length - 4,
                  store.account.address.length,
                )}`}
                <img src={ArrowDownWhiteImg} className="header__account-arrow" alt="account" />
              </Button>
            ) : (
              <Button
                className="header__menu-btn"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(false);
                  setWalletsMenuOpen(true);
                  toggleWalletMenu(true);
                }}
              >
                {t('header.menu.connectWallet')}
              </Button>
            )}

            <div className="header__menu-nav">
              <NavLink exact to="/" className="header__menu-nav-item text-bold text-slg text-black">
                {t('header.menu.main')}
              </NavLink>
              <NavLink
                exact
                to="/staking"
                className="header__menu-nav-item text-bold text-slg text-black"
              >
                {t('header.menu.staking')}
              </NavLink>
              <NavLink
                exact
                to="/mining"
                className="header__menu-nav-item text-bold text-slg text-black"
              >
                {t('header.menu.mining')}
              </NavLink>
              <NavLink
                exact
                to="/about"
                className="header__menu-nav-item text-bold text-slg text-black"
              >
                {t('header.menu.aboutUs')}
              </NavLink>
            </div>
          </div>
        </div>

        {/* Desktop */}

        <div className="header__content box-f box-f-ai-c box-f-jc-sb hidden-mobile">
          <div className="header__wrapper box-f box-f-ai-c">
            <Link to="/" className="header__logo">
              <img src={LogoImg} alt="" />
            </Link>
            <div className="header__nav box-f-ai-c">
              <NavLink exact to="/" className="header__nav-item text-bold text-md text-black">
                {t('header.menu.main')}
                <img src={ArrowImg} alt="" className="header__nav-item-img" />
              </NavLink>
              <NavLink
                exact
                to="/staking"
                className="header__nav-item text-bold text-md text-black"
              >
                {t('header.menu.staking')}
                <img src={ArrowImg} alt="" className="header__nav-item-img" />
              </NavLink>
              <NavLink exact to="/mining" className="header__nav-item text-bold text-md text-black">
                {t('header.menu.mining')}
                <img src={ArrowImg} alt="" className="header__nav-item-img" />
              </NavLink>
              <NavLink exact to="/about" className="header__nav-item text-bold text-md text-black">
                {t('header.menu.aboutUs')}
                <img src={ArrowImg} alt="" className="header__nav-item-img" />
              </NavLink>
            </div>
          </div>

          <div className="header-right">
            {isWalletsMenuOpen || menu.walletsOpen ? (
              <div
                className="header__wallets-close box-f-c"
                onClick={() => {
                  setWalletsMenuOpen(false);
                  toggleWalletMenu(false);
                }}
                onKeyDown={() => {
                  setWalletsMenuOpen(false);
                  toggleWalletMenu(false);
                }}
                role="button"
                tabIndex={0}
              >
                <img src={CrossImg} alt="close" />
              </div>
            ) : store.account.address ? (
              <Button
                className="header__wallets-open"
                size="sm"
                onClick={() => {
                  setWalletsMenuOpen(true);
                }}
              >
                <img src={UserImg} className="header__account-logo" alt="account" />
                <div className="text-upper text-smd">
                  {`${store.account.address.substring(0, 4)}...${store.account.address.slice(
                    store.account.address.length - 4,
                    store.account.address.length,
                  )}`}
                </div>
                <img src={ArrowDownWhiteImg} className="header__account-arrow" alt="account" />
              </Button>
            ) : (
              <Button
                className="header__wallets-open"
                size="sm"
                onClick={() => {
                  setWalletsMenuOpen(true);
                  toggleWalletMenu(true);
                }}
              >
                <div className="text-upper text-smd">{t('header.menu.connectWallet')}</div>
              </Button>
            )}

            {/* Desktop: Translation Buttons */}

            <div className="language-wrap">
              <div className="language-select">
                <ul
                  role="presentation"
                  className={cn('language-select-list', {
                    opened: langToggle,
                  })}
                  onKeyDown={() => handleToggleLanguage()}
                  onClick={() => handleToggleLanguage()}
                >
                  {langList.map((item) => (
                    <li
                      role="presentation"
                      key={nextId()}
                      onClick={() => changeLanguage(item.lng)}
                      onKeyDown={() => changeLanguage(item.lng)}
                      className={cn({
                        active: item.active,
                      })}
                    >
                      <span>{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;
