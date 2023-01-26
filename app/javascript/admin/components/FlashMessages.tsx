import * as React from 'react';

import { Classes, Intent, Overlay, Toast } from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';

import { removeFlashMessage } from '../actions/flashMessages';
import { IState } from '../reducers';

export type FlashMessageType = 'success' | 'error' | 'info' | 'warning';

const TYPE_TO_INTENT = {
  success: Intent.SUCCESS,
  error: Intent.DANGER,
  info: Intent.NONE,
  warning: Intent.WARNING,
};

export default function FlashMessages() {
  const messages = useSelector((state: IState) => state.flashMessages);
  const dispatch = useDispatch();

  const onCloseClick = (id: string) => () => {
    dispatch(removeFlashMessage(id));
  };

  return (
    <Overlay
      autoFocus={false}
      canOutsideClickClose={false}
      enforceFocus={false}
      hasBackdrop={false}
      isOpen={messages.length > 0}
      className={Classes.TOAST_CONTAINER}
    >
      {messages.map((message) => (
        <Toast
          key={message.id}
          message={message.message}
          intent={TYPE_TO_INTENT[message.type]}
          timeout={0}
          onDismiss={onCloseClick(message.id)}
        />
      ))}
    </Overlay>
  );
}
