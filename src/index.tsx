// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line no-param-reassign
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import ScollToTop from './utils/ScollToTop';
import { App } from './App';
import { AppStore, StoreProvider } from './store';
import './utils/i18n';

const store = new AppStore();

ReactDOM.render(
  <Router>
    <ScollToTop>
      <StoreProvider store={store}>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </StoreProvider>
    </ScollToTop>
  </Router>,
  document.getElementById('root'),
);
