import * as React from 'react';

import { Colors, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as Slate from 'slate';
import { Rule } from 'slate-html-serializer';
import { RenderNodeProps } from 'slate-react';

import { IToolbarItem } from '../toolbar';

export default function List() {
  return {
    plugins: [
      {
        renderNode: (props: RenderNodeProps) => {
          if (props.node.type === 'unordered-list') {
            return <UnorderedListNode {...props} />;
          }
          if (props.node.type === 'ordered-list') {
            return <OrderedListNode {...props} />;
          }
          if (props.node.type === 'list-item') {
            return <ListItemNode {...props} />;
          }
        },
      },
    ],
    toolbarItems: [unorderedListToolbarItem, orderedListToolbarItem],
    htmlSerializerRule,
  };
}

const isList = (value: Slate.Value) =>
  value.blocks.some((node) => (node ? node.type === 'list-item' : false));

const isType = (value: Slate.Value, type: 'unordered-list' | 'ordered-list') => {
  return value.blocks.some((block) => {
    return block
      ? !!value.document.getClosest(block.key, (parent) => (parent as any).type === type)
      : false;
  });
};

const onToolbarItemMouseDown = (
  value: Slate.Value,
  onChange: (change: Slate.Change) => void,
  type: 'unordered-list' | 'ordered-list',
) => (event: React.MouseEvent<HTMLSpanElement>) => {
  event.preventDefault();
  const change = value.change();

  if (isList(value) && isType(value, type)) {
    (change as any).withoutNormalization((c) => {
      c.setBlocks('paragraph')
        .unwrapBlock('unordered-list')
        .unwrapBlock('ordered-list');
    });
  } else if (isList(value)) {
    (change as any).withoutNormalization((c) => {
      c.unwrapBlock(type === 'unordered-list' ? 'ordered-list' : 'unordered-list').wrapBlock(type);
    });
  } else {
    (change as any).withoutNormalization((c) => {
      c.setBlocks('list-item').wrapBlock(type);
    });
  }

  onChange(change);
};

const unorderedListToolbarItem: IToolbarItem = {
  renderItem: (props) => {
    const { onChange, value } = props;

    const isActive = isList(value) && isType(value, 'unordered-list');

    return (
      <span
        style={{ cursor: 'pointer', display: 'inline-block', padding: '3px 10px' }}
        onMouseDown={onToolbarItemMouseDown(value, onChange, 'unordered-list')}
      >
        <Icon icon={IconNames.PROPERTIES} color={isActive ? Colors.DARK_GRAY4 : Colors.GRAY4} />
      </span>
    );
  },
};

const orderedListToolbarItem: IToolbarItem = {
  renderItem: (props) => {
    const { onChange, value } = props;

    const isActive = isList(value) && isType(value, 'ordered-list');

    return (
      <span
        style={{ cursor: 'pointer', display: 'inline-block', padding: '3px 10px' }}
        onMouseDown={onToolbarItemMouseDown(value, onChange, 'ordered-list')}
      >
        <Icon icon={IconNames.NUMBERED_LIST} color={isActive ? Colors.DARK_GRAY4 : Colors.GRAY4} />
      </span>
    );
  },
};

const UnorderedListNode = (props: RenderNodeProps) => {
  const { attributes, children } = props;

  return <ul {...attributes}>{children}</ul>;
};

const OrderedListNode = (props: RenderNodeProps) => {
  const { attributes, children } = props;

  return <ol {...attributes}>{children}</ol>;
};

const ListItemNode = (props: RenderNodeProps) => {
  const { attributes, children } = props;

  return <li {...attributes}>{children}</li>;
};

const htmlSerializerRule: Rule = {
  serialize(object, children) {
    if (object.object === 'block' && object.type === 'unordered-list') {
      return <ul>{children}</ul>;
    }
    if (object.object === 'block' && object.type === 'ordered-list') {
      return <ol>{children}</ol>;
    }
    if (object.object === 'block' && object.type === 'list-item') {
      return <li>{children}</li>;
    }
  },
};
