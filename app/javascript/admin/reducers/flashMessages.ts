import type { Action } from '../actions/flashMessages';

type IFlashMessagesState = Array<{
  id: string;
  message: string;
  type: string;
}>;

export default function flashMessages(state: IFlashMessagesState = [], action: Action) {
  switch (action.type) {
    case 'ADD_FLASH_MESSAGE_ACTION':
      return [...state, action.payload];

    case 'REMOVE_FLASH_MESSAGE_ACTION':
      return state.filter((m) => m.id !== action.payload.id);

    default:
      return state;
  }
}
