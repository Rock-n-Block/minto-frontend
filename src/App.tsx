import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { HomePage } from './pages';
import { Header } from './components/organisms';

import './styles/index.scss';

export const App: React.FC = () => {
  return (
    <div className="minto">
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
      </Switch>
    </div>
  );
};
