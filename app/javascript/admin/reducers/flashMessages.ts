import { Action } from '../actions/flashMessages';

export default function flashMessages(state: string[] = [], action: Action) {
  switch (action.type) {
    case 'ADD_FLASH_MESSAGE_ACTION':
      return [action.payload];

    case 'REMOVE_FLASH_MESSAGE_ACTION':
      return [];

    default:
      return state;
  }
}
