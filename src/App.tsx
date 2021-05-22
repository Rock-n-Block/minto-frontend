import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { HomePage } from './pages';

import './styles/index.scss';

export const App: React.FC = () => {
  return (
    <div className="minto">
      <Switch>
        <Route exact path="/" component={HomePage} />
      </Switch>
    </div>
  );
};
