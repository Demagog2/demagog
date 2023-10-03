/* eslint-env browser */

import '@babel/polyfill';
import 'whatwg-fetch';

import * as Sentry from '@sentry/browser';

import 'normalize.css/normalize.css';

import '@blueprintjs/core/lib/css/blueprint';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';

// Hot loader needs to be loaded before react
import 'react-hot-loader';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ApolloProvider } from 'react-apollo';
import { Provider as ReduxProvider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';

import apolloClient from './apolloClient';

import * as ActiveStorage from 'activestorage';

import App from './App';
import rootEpic from './epics';
import rootReducer from './reducers';
Sentry.init({
  dsn: 'https://8a23e3e572a242059ecd4aa01ff8fbd2@sentry.io/1234584',
});

ActiveStorage.start();

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epicMiddleware = createEpicMiddleware();

// Any used to fool broken provider store
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(epicMiddleware)));

epicMiddleware.run(rootEpic);

const render = (RootContainer) => {
  ReactDOM.render(
    <ApolloProvider client={apolloClient}>
      <ReduxProvider store={store}>
        <RootContainer />
      </ReduxProvider>
    </ApolloProvider>,
    document.getElementById('app-root'),
  );
};

// #app-root element is not present on the admin login page
if (document.getElementById('app-root') !== null) {
  render(App);
}
