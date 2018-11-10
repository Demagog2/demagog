import { isKeyHotkey } from 'is-hotkey';
import * as Slate from 'slate';

export default function Hotkey(hotkey, command: (editor: Slate.Editor) => void) {
  // TODO: cast to any, because the changes in slate 0.43.0 are not yet
  // reflected in the @types/slate.
  const castedCommand = command as any;

  return {
    onKeyDown(event, editor: Slate.Editor, next: () => void) {
      if (isKeyHotkey(hotkey, event)) {
        editor.command(castedCommand);
      } else {
        return next();
      }
    },
  };
}
