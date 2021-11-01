import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import moment from "moment";

import { Footer, Header, Links } from './components/organisms';
import {
  AboutPage,
  AmdinPage,
  HomePage,
  MiningPage,
  PresalePage,
  StakingPage,
  StatisticPage,
} from './pages';

import 'react-toastify/dist/ReactToastify.css';
import './styles/index.scss';

export const App: React.FC = () => {

  const currentTime = +(moment.utc().format('X')); // Timestamp - Sun, 21 Apr 2013 12:30:00 GMT
  const eventTime = +moment.utc('2021-11-01T12:00:00').format('X'); // Timestamp - Sun, 21 Apr 2013 13:00:00 GMT

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
        <Route path="/presale" component={currentTime > eventTime ? HomePage : PresalePage} />
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
