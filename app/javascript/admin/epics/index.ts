import { combineEpics } from 'redux-observable';
import flashMessages from './flashMessages';

export default combineEpics(flashMessages);
