import { combineReducers } from 'redux';

import currentUser, { ICurrentUserState } from './currentUser';
import flashMessages from './flashMessages';
import roles, { IRolesState } from './roles';

export interface IState {
  currentUser: ICurrentUserState;
  flashMessages: string[];
  roles: IRolesState;
}

export default combineReducers({
  currentUser,
  flashMessages,
  roles,
});
