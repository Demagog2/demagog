import { combineReducers } from 'redux';

import flashMessages from './flashMessages';

export interface IState {
  flashMessages: string[];
}

export default combineReducers({
  flashMessages,
});
