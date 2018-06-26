import {
  Action,
  FETCH_ROLES,
  FETCH_ROLES_FAILURE,
  FETCH_ROLES_SUCCESS,
  Roles,
} from '../actions/roles';

export interface IRolesState {
  isFetching: boolean;
  roles: Roles | null;
}

const INITIAL_STATE: IRolesState = {
  isFetching: false,
  roles: null,
};

export default function roles(state: IRolesState = INITIAL_STATE, action: Action): IRolesState {
  switch (action.type) {
    case FETCH_ROLES:
      return {
        ...state,
        isFetching: true,
      };

    case FETCH_ROLES_SUCCESS:
      return {
        isFetching: false,
        roles: action.payload.roles,
      };

    case FETCH_ROLES_FAILURE:
      return {
        ...state,
        isFetching: false,
      };

    default:
      return state;
  }
}
