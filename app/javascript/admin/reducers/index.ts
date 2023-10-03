import { combineReducers } from 'redux';

import type { ICurrentUserState } from './currentUser';
import currentUser from './currentUser';
import flashMessages from './flashMessages';

export interface IState {
  currentUser: ICurrentUserState;
  flashMessages: string[];
}

export default combineReducers({
  currentUser,
  flashMessages,
});
