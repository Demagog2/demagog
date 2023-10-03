import type { ActionsObservable } from 'redux-observable';
import { ofType } from 'redux-observable';
import { delay, map } from 'rxjs/operators';

import type { Action } from '../actions/flashMessages';
import { removeFlashMessage } from '../actions/flashMessages';

export default (action$: ActionsObservable<Action>) =>
  action$.pipe(
    ofType('ADD_FLASH_MESSAGE_ACTION'),
    delay(5000),
    map((addFlashMessageAction) => {
      return removeFlashMessage(addFlashMessageAction.payload.id);
    }),
  );
