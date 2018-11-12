import { ApolloQueryResult } from 'apollo-client';
import * as Sentry from '@sentry/browser';
import { ActionsObservable, ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';

import apolloClient from '../apolloClient';
import { GetCurrentUserQuery } from '../operation-result-types';
import { GetCurrentUser } from '../queries/queries';

import {
  Action,
  FETCH_CURRENT_USER,
  fetchCurrentUserFailure,
  fetchCurrentUserSuccess,
} from '../actions/currentUser';

export default (action$: ActionsObservable<Action>) =>
  action$.pipe(
    ofType(FETCH_CURRENT_USER),
    switchMap(() =>
      apolloClient
        .query({ query: GetCurrentUser })
        .then((result: ApolloQueryResult<GetCurrentUserQuery>) => {
          if (result.errors) {
            console.error(result.errors); // tslint:disable-line:no-console
            Sentry.captureException(new Error(JSON.stringify(result.errors)));

            return fetchCurrentUserFailure();
          }

          return fetchCurrentUserSuccess(result.data.current_user);
        })
        .catch((error) => {
          console.error(error); // tslint:disable-line:no-console
          Sentry.captureException(error);

          return fetchCurrentUserFailure();
        }),
    ),
  );
