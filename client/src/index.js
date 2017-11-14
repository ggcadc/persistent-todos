import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Redirect } from 'react-router-dom';
import App from './App';
import randomWords from 'random-words';

ReactDOM.render(
  <HashRouter>
    <Route
      path="*"
      render={() => (
        window.location.hash === '#/' ?
          <Redirect to={`/${randomWords()}`}/> :
          <App session={window.location.hash.slice(2)} />
          )}
    />
  </HashRouter>,
  document.getElementById('root'),
);
