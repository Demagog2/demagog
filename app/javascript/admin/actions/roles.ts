import { GetRolesQuery } from '../operation-result-types';

export type Roles = GetRolesQuery['roles'];

export type Action = IFetchRolesAction | IFetchRolesSuccessAction | IFetchRolesFailureAction;

// =================================================

export const FETCH_ROLES = 'FETCH_ROLES';

interface IFetchRolesAction {
  type: 'FETCH_ROLES';
}

export function fetchRoles(): IFetchRolesAction {
  return {
    type: FETCH_ROLES,
  };
}

// =================================================

export const FETCH_ROLES_SUCCESS = 'FETCH_ROLES_SUCCESS';

interface IFetchRolesSuccessAction {
  type: 'FETCH_ROLES_SUCCESS';
  payload: {
    roles: Roles;
  };
}

export function fetchRolesSuccess(roles): IFetchRolesSuccessAction {
  return {
    type: FETCH_ROLES_SUCCESS,
    payload: {
      roles,
    },
  };
}

// =================================================

export const FETCH_ROLES_FAILURE = 'FETCH_ROLES_FAILURE';

interface IFetchRolesFailureAction {
  type: 'FETCH_ROLES_FAILURE';
}

export function fetchRolesFailure(): IFetchRolesFailureAction {
  return {
    type: FETCH_ROLES_FAILURE,
  };
}
