/* eslint-env browser */

import 'whatwg-fetch';

import * as Sentry from '@sentry/browser';
Sentry.init({
  dsn: 'https://8a23e3e572a242059ecd4aa01ff8fbd2@sentry.io/1234584',
});

import 'normalize.css/normalize.css';

import '@blueprintjs/core/lib/css/blueprint';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';

import 'react-select/dist/react-select.css';

import 'jquery';
import 'jquery-ujs';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';

import apolloClient from './apolloClient';

import * as ActiveStorage from 'activestorage';

ActiveStorage.start();

// import { Classes, FormGroup } from '@blueprintjs/core';

// We use the required label the other way around: to mark fields which
// are NOT required
// FormGroup.DEFAULT_REQUIRED_CONTENT = (
//   <small className={Classes.TEXT_MUTED} style={{ paddingLeft: 7 }}>
//     nepovinné
//   </small>
// );

import App from './App';
import rootEpic from './epics';
import rootReducer from './reducers';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epicMiddleware = createEpicMiddleware(rootEpic);

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(epicMiddleware)));

const render = (RootContainer) =>
  ReactDOM.render(
    <AppContainer>
      <ApolloProvider client={apolloClient}>
        <Provider store={store}>
          <RootContainer />
        </Provider>
      </ApolloProvider>
    </AppContainer>,
    document.getElementById('app-root'),
  );

render(App);

if ((module as any).hot) {
  (module as any).hot.accept('./App', () => render(App));
}
