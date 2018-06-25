import { combineReducers } from 'redux';

import currentUser, { ICurrentUserState } from './currentUser';
import flashMessages from './flashMessages';

export interface IState {
  currentUser: ICurrentUserState;
  flashMessages: string[];
}

export default combineReducers({
  currentUser,
  flashMessages,
});
