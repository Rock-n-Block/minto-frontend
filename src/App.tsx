import React from 'react';
import {Switch, Route} from 'react-router-dom';

import {AboutPage, HomePage} from './pages';
import {Footer, Header} from './components/organisms';

import './styles/index.scss';

export const App: React.FC = () => {
  return (
    <div className="minto">
      <Header/>
      <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route exact path="/about" component={AboutPage}/>
      </Switch>
      <Footer/>
    </div>
  );
};
