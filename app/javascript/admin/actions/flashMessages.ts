import { v4 as uuid } from 'uuid';

import type { FlashMessageType } from '../components/FlashMessages';

interface IAddFlashMessageAction {
  type: 'ADD_FLASH_MESSAGE_ACTION';
  payload: {
    id: string;
    message: string;
    type: FlashMessageType;
  };
}

interface IRemoveFlashMessageAction {
  type: 'REMOVE_FLASH_MESSAGE_ACTION';
  payload: {
    id: string;
  };
}

export type Action = IAddFlashMessageAction | IRemoveFlashMessageAction;

export function addFlashMessage(
  message: string,
  type: FlashMessageType = 'info',
): IAddFlashMessageAction {
  return {
    type: 'ADD_FLASH_MESSAGE_ACTION',
    payload: {
      id: uuid(),
      message,
      type,
    },
  };
}

export function removeFlashMessage(id: string): IRemoveFlashMessageAction {
  return {
    type: 'REMOVE_FLASH_MESSAGE_ACTION',
    payload: {
      id,
    },
  };
}
