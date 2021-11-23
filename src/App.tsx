import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { UseWalletProvider } from 'use-wallet';

import { Footer, Header, Links } from './components/organisms';
import {
  AboutPage,
  AmdinPage,
  HomePage,
  MiningPage,
  PurchasePage,
  StakingPage,
  StatisticPage,
} from './pages';

import 'react-toastify/dist/ReactToastify.css';
import './styles/index.scss';

export const App: React.FC = () => {
  const location = useLocation();

  return (
    <div className="minto">
      <UseWalletProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover
        />
        {location.pathname !== '/admin' ? <Header /> : ''}
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/staking" component={StakingPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/mining" component={MiningPage} />
          <Route path="/purchase" component={PurchasePage} />
          <Route path="/stats" component={StatisticPage} />
          <Route path="/admin" component={AmdinPage} />
        </Switch>
        {location.pathname !== '/admin' ? (
          <div>
            <Links />
            <Footer />
          </div>
        ) : (
          ''
        )}
      </UseWalletProvider>
    </div>
  );
};
