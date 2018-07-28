import * as React from 'react';

import { Colors, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { isKeyHotkey } from 'is-hotkey';
import * as Slate from 'slate';
import { Rule } from 'slate-html-serializer';
import { RenderNodeProps } from 'slate-react';

import { IToolbarItem } from '../toolbar';

const isHeader = (value: Slate.Value) =>
  value.blocks.some((node) => (node ? node.type === 'header' : false));

export default function Header() {
  return {
    plugins: [
      {
        renderNode: (props: RenderNodeProps) => {
          if (props.node.type === 'header') {
            return <HeaderNode {...props} />;
          }
        },
        onKeyDown: (event: React.KeyboardEvent<any>, change: Slate.Change) => {
          // Switch to paragraph when pressing enter in header
          if (isHeader(change.value) && isKeyHotkey('enter', event)) {
            change.splitBlock(1).setBlocks('paragraph');

            // Do not run the default behaviour as that would add second new block
            event.preventDefault();
            return false;
          }
        },
      },
    ],
    toolbarItem,
    htmlSerializerRule,
  };
}

const onToolbarItemMouseDown = (value: Slate.Value, onChange: (change: Slate.Change) => void) => (
  event: React.MouseEvent<HTMLSpanElement>,
) => {
  event.preventDefault();
  const change = value.change();

  if (isHeader(value)) {
    change.setBlocks('paragraph');
  } else {
    change.setBlocks('header');
  }

  onChange(change);
};

const toolbarItem: IToolbarItem = {
  renderItem: (props) => {
    const { onChange, value } = props;

    const isActive = isHeader(value);

    return (
      <span
        style={{ cursor: 'pointer', display: 'inline-block', padding: '3px 10px' }}
        onMouseDown={onToolbarItemMouseDown(value, onChange)}
      >
        <Icon icon={IconNames.HEADER} color={isActive ? Colors.DARK_GRAY4 : Colors.GRAY4} />
      </span>
    );
  },
};

const HeaderNode = (props: RenderNodeProps) => {
  const { attributes, children } = props;

  return <h2 {...attributes}>{children}</h2>;
};

const htmlSerializerRule: Rule = {
  serialize(object, children) {
    if (object.object === 'block' && object.type === 'header') {
      return <h2>{children}</h2>;
    }
  },
  deserialize(el, next) {
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(el.tagName.toLowerCase())) {
      return {
        object: 'block',
        type: 'header',
        nodes: next(el.childNodes),
      };
    }
  },
};
