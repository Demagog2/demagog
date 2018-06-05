import { ActionsObservable, ofType } from 'redux-observable';
import { delay, mapTo } from 'rxjs/operators';

import { Action, removeFlashMessage } from '../actions/flashMessages';

export default (action$: ActionsObservable<Action>) =>
  action$.pipe(
    ofType('ADD_FLASH_MESSAGE_ACTION'),
    delay(5000),
    mapTo(removeFlashMessage()),
  );
