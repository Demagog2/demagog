import * as React from 'react';

import { Colors, Icon, Popover, Position } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { css } from 'emotion';

import { IToolbarItem } from '../toolbar';

export default function Bold() {
  return {
    toolbarItem,
  };
}

const SPECIAL_CHARACTERS = ['€', '£', '¥', '„', '‟', '½', '±', '×'];

const toolbarItem: IToolbarItem = {
  renderItem(props) {
    const { onCommand } = props;

    const onSpecialCharacterMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();

      onCommand((editor) => {
        editor.insertText(event.currentTarget.innerText);
      });
    };

    return (
      <Popover
        autoFocus={false}
        content={
          <div
            className={css`
              padding: 5px;

              span {
                display: inline-block;
                width: 30px;
                height: 30px;
                text-align: center;
                font-size: 16px;
                line-height: 30px;
                cursor: pointer;

                &:hover {
                  background-color: ${Colors.LIGHT_GRAY3};
                }
              }
            `}
          >
            {SPECIAL_CHARACTERS.map((character, index) => (
              <span key={index} onMouseDown={onSpecialCharacterMouseDown}>
                {character}
              </span>
            ))}
          </div>
        }
        position={Position.TOP_LEFT}
      >
        <span
          style={{ cursor: 'pointer', display: 'inline-block', padding: '3px 10px' }}
          title="Speciální znaky"
        >
          <Icon icon={IconNames.EURO} color={Colors.GRAY4} />
        </span>
      </Popover>
    );
  },
};
