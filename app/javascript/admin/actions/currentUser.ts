import type { GetCurrentUser_currentUser } from '../operation-result-types';

export type CurrentUser = GetCurrentUser_currentUser;

export type Action =
  | IFetchCurrentUserAction
  | IFetchCurrentUserSuccessAction
  | IFetchCurrentUserFailureAction;

// =================================================

export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';

interface IFetchCurrentUserAction {
  type: 'FETCH_CURRENT_USER';
}

export function fetchCurrentUser(): IFetchCurrentUserAction {
  return {
    type: FETCH_CURRENT_USER,
  };
}

// =================================================

export const FETCH_CURRENT_USER_SUCCESS = 'FETCH_CURRENT_USER_SUCCESS';

interface IFetchCurrentUserSuccessAction {
  type: 'FETCH_CURRENT_USER_SUCCESS';
  payload: {
    currentUser: CurrentUser;
  };
}

export function fetchCurrentUserSuccess(currentUser): IFetchCurrentUserSuccessAction {
  return {
    type: FETCH_CURRENT_USER_SUCCESS,
    payload: {
      currentUser,
    },
  };
}

// =================================================

export const FETCH_CURRENT_USER_FAILURE = 'FETCH_CURRENT_USER_FAILURE';

interface IFetchCurrentUserFailureAction {
  type: 'FETCH_CURRENT_USER_FAILURE';
}

export function fetchCurrentUserFailure(): IFetchCurrentUserFailureAction {
  return {
    type: FETCH_CURRENT_USER_FAILURE,
  };
}
