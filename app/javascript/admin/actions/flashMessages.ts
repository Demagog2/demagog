interface IAddFlashMessageAction {
  type: 'ADD_FLASH_MESSAGE_ACTION';
  payload: string;
}

interface IRemoveFlashMessageAction {
  type: 'REMOVE_FLASH_MESSAGE_ACTION';
}

export type Action = IAddFlashMessageAction | IRemoveFlashMessageAction;

export function addFlashMessage(message: string): IAddFlashMessageAction {
  return {
    type: 'ADD_FLASH_MESSAGE_ACTION',
    payload: message,
  };
}

export function removeFlashMessage(): IRemoveFlashMessageAction {
  return {
    type: 'REMOVE_FLASH_MESSAGE_ACTION',
  };
}
