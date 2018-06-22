import * as React from 'react';

import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Slate from 'slate';

import { IToolbarItem } from '../toolbar';

export default function ToolbarMarkButton(
  icon: IconDefinition,
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
        <span style={{ cursor: 'pointer', padding: '5px 10px' }} onMouseDown={onMouseDown}>
          <FontAwesomeIcon icon={icon} color={isActive(value) ? '#000' : '#aaa'} />
        </span>
      );
    },
  };
}
