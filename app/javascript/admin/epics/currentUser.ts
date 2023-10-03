import * as Sentry from '@sentry/browser';
import type { ApolloQueryResult } from 'apollo-client';
import type { ActionsObservable } from 'redux-observable';
import { ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';

import apolloClient from '../apolloClient';
import type { GetCurrentUser as GetCurrentUserQuery } from '../operation-result-types';
import { GetCurrentUser } from '../queries/queries';

import type { Action } from '../actions/currentUser';
import {
  FETCH_CURRENT_USER,
  fetchCurrentUserFailure,
  fetchCurrentUserSuccess,
} from '../actions/currentUser';

export default (action$: ActionsObservable<Action>) =>
  action$.pipe(
    ofType(FETCH_CURRENT_USER),
    switchMap(async() =>
      await apolloClient
        .query({ query: GetCurrentUser })
        .then((result: ApolloQueryResult<GetCurrentUserQuery>) => {
          if (result.errors) {
            console.error(result.errors); Sentry.captureException(new Error(JSON.stringify(result.errors)));

            return fetchCurrentUserFailure();
          }

          return fetchCurrentUserSuccess(result.data.currentUser);
        })
        .catch((error) => {
          console.error(error); Sentry.captureException(error);

          return fetchCurrentUserFailure();
        }),
    ),
  );
