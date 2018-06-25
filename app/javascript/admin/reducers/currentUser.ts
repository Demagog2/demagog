import {
  Action,
  CurrentUser,
  FETCH_CURRENT_USER,
  FETCH_CURRENT_USER_FAILURE,
  FETCH_CURRENT_USER_SUCCESS,
} from '../actions/currentUser';

export interface ICurrentUserState {
  isFetching: boolean;
  user: CurrentUser | null;
}

const INITIAL_STATE: ICurrentUserState = {
  isFetching: false,
  user: null,
};

export default function currentUser(state: ICurrentUserState = INITIAL_STATE, action: Action) {
  switch (action.type) {
    case FETCH_CURRENT_USER:
      return {
        ...state,
        isFetching: true,
      };

    case FETCH_CURRENT_USER_SUCCESS:
      return {
        isFetching: false,
        user: action.payload.currentUser,
      };

    case FETCH_CURRENT_USER_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    default:
      return state;
  }
}
