import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addFlashMessage } from '../actions/flashMessages';
import { FlashMessageType } from '../components/FlashMessages';

export function useFlashMessage() {
  const dispatch = useDispatch();

  return useCallback(
    (message: string, type: FlashMessageType) => {
      dispatch(addFlashMessage(message, type));
    },
    [dispatch],
  );
}
