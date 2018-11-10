import * as React from 'react';

import { Colors, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { isKeyHotkey } from 'is-hotkey';
import * as Slate from 'slate';
import * as SlateHtmlSerializer from 'slate-html-serializer';
import { RenderNodeProps } from 'slate-react';

import { IToolbarItem } from '../toolbar';

const isHeader = (value: Slate.Value) =>
  value.blocks.some((node) => (node ? node.type === 'header' : false));

export default function Header() {
  return {
    plugins: [
      {
        renderNode: (props: RenderNodeProps, _, next: () => void) => {
          if (props.node.object === 'block' && props.node.type === 'header') {
            return <HeaderNode {...props} />;
          } else {
            return next();
          }
        },
        onKeyDown: (event: React.KeyboardEvent<any>, editor: Slate.Editor, next: () => void) => {
          // Switch to paragraph when pressing enter in header
          if (isHeader(editor.value) && isKeyHotkey('enter', event)) {
            editor.splitBlock(1).setBlocks('paragraph');
          } else {
            return next();
          }
        },
      },
    ],
    toolbarItem,
    htmlSerializerRule,
  };
}

const onToolbarItemMouseDown = (
  value: Slate.Value,
  onCommand: (command: (editor: Slate.Editor) => void) => void,
) => (event: React.MouseEvent<HTMLSpanElement>) => {
  event.preventDefault();

  onCommand((editor) => {
    if (isHeader(value)) {
      editor.setBlocks('paragraph');
    } else {
      editor.setBlocks('header');
    }
  });
};

const toolbarItem: IToolbarItem = {
  renderItem: (props) => {
    const { onCommand, value } = props;

    const isActive = isHeader(value);

    return (
      <span
        style={{ cursor: 'pointer', display: 'inline-block', padding: '3px 10px' }}
        onMouseDown={onToolbarItemMouseDown(value, onCommand)}
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

const htmlSerializerRule: SlateHtmlSerializer.Rule = {
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
