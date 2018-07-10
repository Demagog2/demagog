import * as React from 'react';

import { Icon } from '@blueprintjs/core';
import { IconName } from '@blueprintjs/icons';
import * as Slate from 'slate';

import { IToolbarItem } from '../toolbar';

export default function ToolbarMarkButton(
  icon: IconName,
  change: (change: Slate.Change) => Slate.Change,
  isActive: (value: Slate.Value) => boolean,
): IToolbarItem {
  return {
    renderItem(props) {
      const { onChange, value } = props;

      const onMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        onChange(value.change().call(change));
      };

      return (
        <span
          style={{ cursor: 'pointer', display: 'inline-block', padding: '3px 10px' }}
          onMouseDown={onMouseDown}
        >
          {/* <FontAwesomeIcon icon={icon} color={isActive(value) ? '#000' : '#aaa'} /> */}
          <Icon icon={icon} color={isActive(value) ? '#000' : '#aaa'} />
        </span>
      );
    },
  };
}
