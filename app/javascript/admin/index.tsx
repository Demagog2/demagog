/* eslint-env browser */

import 'whatwg-fetch';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { createEpicMiddleware } from 'redux-observable';

/* eslint-disable import/no-extraneous-dependencies */
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createUploadLink } from 'apollo-upload-client';

import 'jquery';
import 'jquery-ujs';

import * as ActiveStorage from 'activestorage';

ActiveStorage.start();

import App from './App';
import rootEpic from './epics';
import rootReducer from './reducers';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createUploadLink({ credentials: 'same-origin' }),
});

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epicMiddleware = createEpicMiddleware(rootEpic);

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(epicMiddleware)));

const render = (RootContainer) =>
  ReactDOM.render(
    <AppContainer>
      <ApolloProvider client={client}>
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
