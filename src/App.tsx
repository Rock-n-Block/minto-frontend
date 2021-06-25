import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { Footer, Header, Links } from './components/organisms';
import { AboutPage, AmdinPage, HomePage, MiningPage, StakingPage, StatisticPage } from './pages';

import 'react-toastify/dist/ReactToastify.css';
import './styles/index.scss';

export const App: React.FC = () => {
  const location = useLocation();

  return (
    <div className="minto">
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
    </div>
  );
};
