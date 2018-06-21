import { isKeyHotkey } from 'is-hotkey';

export default function Hotkey(hotkey, fn) {
  return {
    onKeyDown(event, change) {
      if (isKeyHotkey(hotkey, event)) {
        change.call(fn);
      }
    },
  };
}
