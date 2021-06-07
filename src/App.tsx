import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { Footer, Header, Links } from './components/organisms';
import { AboutPage, HomePage, MiningPage, StakingPage } from './pages';

import 'react-toastify/dist/ReactToastify.css';
import './styles/index.scss';

export const App: React.FC = () => {
  return (
    <div className="minto">
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover
      />
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/staking" component={StakingPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/mining" component={MiningPage} />
      </Switch>
      <Links />
      <Footer />
    </div>
  );
};
