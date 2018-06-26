import { combineEpics } from 'redux-observable';

import currentUser from './currentUser';
import flashMessages from './flashMessages';
import roles from './roles';

export default combineEpics<any>(currentUser, flashMessages, roles);
