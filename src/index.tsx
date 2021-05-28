// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line no-param-reassign
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import ScollToTop from './utils/ScollToTop';
import { App } from './App';

import { AppStore, StoreProvider } from './store';

const store = new AppStore();

ReactDOM.render(
  <Router>
    <ScollToTop>
      <StoreProvider store={store}>
        <App />
      </StoreProvider>
    </ScollToTop>
  </Router>,
  document.getElementById('root'),
);
