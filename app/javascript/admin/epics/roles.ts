import { ApolloQueryResult } from 'apollo-client';
import { ActionsObservable, ofType } from 'redux-observable';
import { switchMap } from 'rxjs/operators';

import apolloClient from '../apolloClient';
import { GetRolesQuery } from '../operation-result-types';
import { GetRoles } from '../queries/queries';

import { Action, FETCH_ROLES, fetchRolesFailure, fetchRolesSuccess } from '../actions/roles';

export default (action$: ActionsObservable<Action>) =>
  action$.pipe(
    ofType(FETCH_ROLES),
    switchMap(() =>
      apolloClient
        .query({ query: GetRoles })
        .then((result: ApolloQueryResult<GetRolesQuery>) => {
          if (result.errors) {
            console.error(result.errors); // tslint:disable-line:no-console
            return fetchRolesFailure();
          }

          return fetchRolesSuccess(result.data.roles);
        })
        .catch((error) => {
          console.error(error); // tslint:disable-line:no-console
          return fetchRolesFailure();
        }),
    ),
  );
