import * as React from 'react';

import { Colors, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as Slate from 'slate';
import * as SlateHtmlSerializer from 'slate-html-serializer';
import { RenderNodeProps } from 'slate-react';

import { IToolbarItem } from '../toolbar';

export default function List() {
  return {
    plugins: [
      {
        renderNode: (props: RenderNodeProps, _, next: () => void) => {
          if (props.node.object === 'block' && props.node.type === 'unordered-list') {
            return <UnorderedListNode {...props} />;
          } else if (props.node.object === 'block' && props.node.type === 'ordered-list') {
            return <OrderedListNode {...props} />;
          } else if (props.node.object === 'block' && props.node.type === 'list-item') {
            return <ListItemNode {...props} />;
          } else {
            return next();
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
  onCommand: (command: (editor: Slate.Editor) => void) => void,
  type: 'unordered-list' | 'ordered-list',
) => (event: React.MouseEvent<HTMLSpanElement>) => {
  event.preventDefault();

  if (isList(value) && isType(value, type)) {
    onCommand((editor) => {
      editor.withoutNormalizing(() => {
        editor
          .setBlocks('paragraph')
          .unwrapBlock('unordered-list')
          .unwrapBlock('ordered-list');
      });
    });
  } else if (isList(value)) {
    onCommand((editor) => {
      editor.withoutNormalizing(() => {
        editor
          .unwrapBlock(type === 'unordered-list' ? 'ordered-list' : 'unordered-list')
          .wrapBlock(type);
      });
    });
  } else {
    onCommand((editor) => {
      editor.withoutNormalizing(() => {
        editor.setBlocks('list-item').wrapBlock(type);
      });
    });
  }
};

const unorderedListToolbarItem: IToolbarItem = {
  renderItem: (props) => {
    const { onCommand, value } = props;

    const isActive = isList(value) && isType(value, 'unordered-list');

    return (
      <span
        style={{ cursor: 'pointer', display: 'inline-block', padding: '3px 10px' }}
        onMouseDown={onToolbarItemMouseDown(value, onCommand, 'unordered-list')}
      >
        <Icon icon={IconNames.PROPERTIES} color={isActive ? Colors.DARK_GRAY4 : Colors.GRAY4} />
      </span>
    );
  },
};

const orderedListToolbarItem: IToolbarItem = {
  renderItem: (props) => {
    const { onCommand, value } = props;

    const isActive = isList(value) && isType(value, 'ordered-list');

    return (
      <span
        style={{ cursor: 'pointer', display: 'inline-block', padding: '3px 10px' }}
        onMouseDown={onToolbarItemMouseDown(value, onCommand, 'ordered-list')}
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

const htmlSerializerRule: SlateHtmlSerializer.Rule = {
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
  deserialize(el: HTMLElement, next) {
    if (el.tagName.toLowerCase() === 'ol') {
      const listItemsChildren = (Array.from((el.childNodes as any).values()) as Element[]).filter(
        (node) => node.nodeName === 'LI',
      );

      return {
        object: 'block',
        type: 'ordered-list',
        nodes: next(listItemsChildren),
      };
    }
    if (el.tagName.toLowerCase() === 'ul') {
      const listItemsChildren = (Array.from((el.childNodes as any).values()) as Element[]).filter(
        (node) => node.nodeName === 'LI',
      );

      return {
        object: 'block',
        type: 'unordered-list',
        nodes: next(listItemsChildren),
      };
    }
    if (el.tagName.toLowerCase() === 'li') {
      let childNodes = el.childNodes;

      // Google Docs wraps text inside <li> tags also to <p> tag, which is
      // invalid in our schema, so lets skip the <p> tag right here
      if (el.childNodes.length === 1 && el.childNodes.item(0).nodeName === 'P') {
        childNodes = el.childNodes.item(0).childNodes;
      }

      return {
        object: 'block',
        type: 'list-item',
        nodes: next(childNodes),
      };
    }
  },
};
