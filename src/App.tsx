import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { AboutPage, HomePage, StakingPage, MiningPage } from './pages';
import { Footer, Header, Links } from './components/organisms';

import './styles/index.scss';

export const App: React.FC = () => {
  return (
    <div className="minto">
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/staking" component={StakingPage} />
        <Route exact path="/about" component={AboutPage} />
        <Route exact path="/mining" component={MiningPage} />
      </Switch>
      <Links />
      <Footer />
    </div>
  );
};
