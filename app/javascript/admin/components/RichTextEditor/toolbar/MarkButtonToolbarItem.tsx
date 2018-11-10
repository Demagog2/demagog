import * as React from 'react';

import { Colors, Icon } from '@blueprintjs/core';
import { IconName } from '@blueprintjs/icons';
import * as Slate from 'slate';

import { IToolbarItem } from './index';

export default function MarkButtonToolbarItem(
  icon: IconName,
  commandOnClick: (editor: Slate.Editor) => void,
  isActive: (value: Slate.Value) => boolean,
): IToolbarItem {
  return {
    renderItem(props) {
      const { onCommand, value } = props;

      const onMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        onCommand(commandOnClick);
      };

      return (
        <span
          style={{ cursor: 'pointer', display: 'inline-block', padding: '3px 10px' }}
          onMouseDown={onMouseDown}
        >
          <Icon icon={icon} color={isActive(value) ? Colors.DARK_GRAY4 : Colors.GRAY4} />
        </span>
      );
    },
  };
}
