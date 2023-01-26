import { combineReducers } from 'redux';
import { FlashMessageType } from '../components/FlashMessages';

import currentUser, { ICurrentUserState } from './currentUser';
import flashMessages from './flashMessages';

export interface IState {
  currentUser: ICurrentUserState;
  flashMessages: Array<{
    id: string;
    message: string;
    type: FlashMessageType;
  }>;
}

export default combineReducers({
  currentUser,
  flashMessages,
});
