import * as React from 'react';

import { NonIdealState } from '@blueprintjs/core';
import { mount } from 'enzyme';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Sources from '../Sources';

import rootReducer from '../../reducers';
import { GetSources } from '../../queries/queries';

const initialState = {
  currentUser: {
    isFetching: false,
    user: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      role: {
        id: 'admin_role',
        key: 'admin',
        name: 'Admin',
        permissions: [],
      },
    },
  },
};

const mocks = [
  {
    request: {
      query: GetSources,
      variables: { name: '', offset: 0, limit: 50 },
    },
    error: {
      error: 'My error',
    },
  },
];

describe('Sources', () => {
  function render() {
    return mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Provider store={createStore(rootReducer, initialState)}>
          <Sources />
        </Provider>
      </MockedProvider>,
    );
  }

  const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  it('should render non ideal state in case of an error', async () => {
    const component = render();

    await sleep(1);

    component.update();

    expect(component.find(NonIdealState)).toHaveLength(1);
  });
});
