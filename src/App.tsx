import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Footer, Header, Links } from './components/organisms';
import { AboutPage, HomePage, MiningPage, StakingPage } from './pages';

import './styles/index.scss';

export const App: React.FC = () => {
  return (
    <div className="minto">
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
