import { combineEpics } from 'redux-observable';

import currentUser from './currentUser';
import flashMessages from './flashMessages';

export default combineEpics(currentUser, flashMessages);
