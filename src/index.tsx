// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line no-param-reassign
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { App } from './App';
import ScollToTop from './utils/ScollToTop';

ReactDOM.render(
  <Router>
    <ScollToTop>
      <App />
    </ScollToTop>
  </Router>,
  document.getElementById('root'),
);
