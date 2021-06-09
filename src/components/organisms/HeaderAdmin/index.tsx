import React from 'react';
import { Link } from 'react-router-dom';
import cn from 'classnames';
import { observer } from 'mobx-react-lite';

import ArrowDownWhiteImg from '../../../assets/img/icons/arrow-down-white.svg';
import CrossImg from '../../../assets/img/icons/cross.svg';
import LogoImg from '../../../assets/img/icons/logo.svg';
import MetamaskImg from '../../../assets/img/icons/metamask.svg';
import NavOpenImg from '../../../assets/img/icons/nav-open.svg';
import SignOutImg from '../../../assets/img/icons/sign-out.svg';
import TokenPocketImg from '../../../assets/img/icons/token-pocket.svg';
import { WalletConnect } from '../../../services/walletconnect';
import { useStore } from '../../../store';
import { clogData } from '../../../utils';
import { Button } from '../../atoms';

import './HeaderAdmin.scss';

const connect = new WalletConnect();

const HeaderAdmin: React.FC<{ isLogin: boolean; onLogOut: any }> = ({
  isLogin = false,
  onLogOut,
}) => {
  const [isWalletsMenuOpen, setWalletsMenuOpen] = React.useState<boolean>(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);

  const store = useStore();
  const { menu, toggleWalletMenu } = store;

  const handleHeaderClick = (): void => {
    if (window.innerWidth < 768 && (isWalletsMenuOpen || isMobileMenuOpen || menu.walletsOpen)) {
      setMobileMenuOpen(false);
      setWalletsMenuOpen(false);
      toggleWalletMenu(false);
    }
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
      className={cn('header-admin', {
        open: isWalletsMenuOpen || isMobileMenuOpen || menu.walletsOpen,
      })}
      onClick={handleHeaderClick}
      onKeyDown={handleHeaderClick}
      role="button"
      tabIndex={0}
    >
      <div className="header-admin__row row-lg">
        {!store.account.address && isLogin ? (
          <div
            className={cn('header-admin__wallets hidden-mobile', {
              open: isWalletsMenuOpen || menu.walletsOpen,
            })}
          >
            <div
              className="header-admin__wallets-item box-f-ai-c"
              onClick={() => handleWalletClick('MetaMask')}
              onKeyDown={() => handleWalletClick('MetaMask')}
              role="button"
              tabIndex={0}
            >
              <img src={MetamaskImg} alt="metamask" className="header-admin__wallets-item-img" />
              <span className="text-bold text-md">MetaMask</span>
            </div>
            <div
              className="header-admin__wallets-item box-f-ai-c"
              onClick={() => handleWalletClick('WalletConnect')}
              onKeyDown={() => handleWalletClick('WalletConnect')}
              role="button"
              tabIndex={0}
            >
              <img src={TokenPocketImg} alt="metamask" className="header-admin__wallets-item-img" />
              <span className="text-bold text-md">TokenPocket</span>
            </div>
          </div>
        ) : (
          <div
            className={cn('header-admin__wallets hidden-mobile', {
              open: isWalletsMenuOpen || menu.walletsOpen,
            })}
          >
            <div
              className="header-admin__wallets-item box-f-ai-c"
              onClick={() => handleLogOutClick()}
              onKeyDown={() => handleLogOutClick()}
              role="button"
              tabIndex={0}
            >
              <img src={SignOutImg} alt="metamask" className="header-admin__wallets-item-img" />
              <span className="text-bold text-md">LogOut</span>
            </div>
          </div>
        )}

        <div className="header-admin__content box-f box-f-ai-c box-f-jc-sb hidden-desktop">
          <div className="header-admin__wrapper">
            {!isMobileMenuOpen && !isWalletsMenuOpen && !menu.walletsOpen ? (
              <div
                className="header-admin__nav-open"
                onClick={() => setMobileMenuOpen(true)}
                onKeyDown={() => setMobileMenuOpen(true)}
                role="button"
                tabIndex={0}
              >
                <img src={NavOpenImg} alt="open" />
              </div>
            ) : (
              <div
                className="header-admin__nav-open"
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
            <Link to="/" className="header-admin__logo">
              <img src={LogoImg} alt="" />
              <span>Administration panel</span>
            </Link>
          </div>
          {!store.account.address ? (
            <div
              className={cn('header-admin__wallets', {
                open: isWalletsMenuOpen || menu.walletsOpen,
              })}
            >
              <div
                className="header-admin__wallets-item box-f-c"
                onClick={() => handleWalletClick('MetaMask')}
                onKeyDown={() => handleWalletClick('MetaMask')}
                role="button"
                tabIndex={0}
              >
                <img src={MetamaskImg} alt="metamask" className="header-admin__wallets-item-img" />
                <span className="text-bold text-lmd">MetaMask</span>
              </div>
              <div
                className="header-admin__wallets-item box-f-c"
                onClick={() => handleWalletClick('WalletConnect')}
                onKeyDown={() => handleWalletClick('WalletConnect')}
                role="button"
                tabIndex={0}
              >
                <img
                  src={TokenPocketImg}
                  alt="metamask"
                  className="header-admin__wallets-item-img"
                />
                <span className="text-bold text-lmd">TokenPocket</span>
              </div>
            </div>
          ) : (
            <div
              className={cn('header-admin__wallets', {
                open: isWalletsMenuOpen || menu.walletsOpen,
              })}
            >
              <div
                className="header-admin__wallets-item box-f-c"
                onClick={() => {
                  handleLogOutClick();
                }}
                onKeyDown={() => {
                  handleLogOutClick();
                }}
                role="button"
                tabIndex={0}
              >
                <img src={SignOutImg} alt="metamask" className="header-admin__wallets-item-img" />
                <span className="text-bold text-lmd">LogOut</span>
              </div>
            </div>
          )}
          <div
            className={cn('header-admin__menu', {
              open: isMobileMenuOpen,
            })}
          >
            {store.account.address && isLogin ? (
              <Button
                className="header-admin__menu-btn header-admin__account"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <img
                  src={ArrowDownWhiteImg}
                  className="header-admin__account-arrow"
                  alt="account"
                />
              </Button>
            ) : isLogin ? (
              <Button
                className="header-admin__menu-btn"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(false);
                  setWalletsMenuOpen(true);
                  toggleWalletMenu(true);
                }}
              >
                Connect Wallet
              </Button>
            ) : (
              ''
            )}

            <div className="header-admin__menu-nav">
              {isLogin ? (
                <Button
                  className="header-admin__wallets-open"
                  size="sm"
                  onClick={() => {
                    onLogOut();
                  }}
                >
                  <div className="text-upper text-smd">Admin LogOut</div>
                </Button>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        <div className="header-admin__content box-f box-f-ai-c box-f-jc-sb hidden-mobile">
          <div className="header-admin__wrapper box-f box-f-ai-c">
            <Link to="/" className="header-admin__logo">
              <img src={LogoImg} alt="" />
              <span>Administration panel</span>
            </Link>
            <div className="header-admin__nav box-f-ai-c">
              {isLogin ? (
                <Button
                  className="header-admin__wallets-open"
                  size="sm"
                  onClick={() => {
                    onLogOut();
                  }}
                >
                  <div className="text-upper text-smd">Admin LogOut</div>
                </Button>
              ) : (
                ''
              )}
            </div>
          </div>
          {isWalletsMenuOpen || menu.walletsOpen ? (
            <div
              className="header-admin__wallets-close box-f-c"
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
              className="header-admin__wallets-open header-admin__account"
              size="sm"
              onClick={() => {
                setWalletsMenuOpen(true);
              }}
            >
              <img src={ArrowDownWhiteImg} className="header-admin__account-arrow" alt="account" />
            </Button>
          ) : isLogin ? (
            <Button
              className="header-admin__wallets-open"
              size="sm"
              onClick={() => {
                setWalletsMenuOpen(true);
                toggleWalletMenu(true);
              }}
            >
              <div className="text-upper text-smd">Connect Wallet</div>
            </Button>
          ) : (
            ''
          )}
        </div>
      </div>
    </header>
  );
};

export default observer(HeaderAdmin);
