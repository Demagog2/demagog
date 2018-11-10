import * as React from 'react';

import { Colors, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as Slate from 'slate';
import * as SlateHtmlSerializer from 'slate-html-serializer';
import { RenderNodeProps } from 'slate-react';

import { IToolbarItem } from '../toolbar';

export default function Embed() {
  return {
    plugins: [
      {
        renderNode: (props: RenderNodeProps, _, next: () => void) => {
          if (props.node.object === 'block' && props.node.type === 'embed') {
            return <EmbedNode {...props} />;
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

function insertEmbed(editor: Slate.Editor, code: string) {
  editor.insertBlock({
    type: 'embed',
    data: { code },
  });
}

const toolbarItem: IToolbarItem = {
  renderItem(props) {
    const { onCommand } = props;

    const onMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();

      const code = window.prompt('Vložte embedovaný kód (začíná většinou znaky "<iframe "):');
      if (code === null || code === '') {
        return;
      }

      onCommand((editor) => {
        insertEmbed(editor, code);
      });
    };

    return (
      <span
        style={{ cursor: 'pointer', display: 'inline-block', padding: '3px 10px' }}
        onMouseDown={onMouseDown}
      >
        <Icon icon={IconNames.CODE} color={Colors.GRAY4} />
      </span>
    );
  },
};

const EmbedNode = (props: RenderNodeProps) => {
  const { attributes, node, isSelected } = props;

  const code = (node as Slate.Block).data.get('code');
  const style = isSelected
    ? { boxShadow: '0 0 2px', marginBottom: '1rem' }
    : { marginBottom: '1rem' };

  return <div style={style} {...attributes} dangerouslySetInnerHTML={{ __html: code }} />;
};

const htmlSerializerRule: SlateHtmlSerializer.Rule = {
  serialize(object) {
    if (object.object === 'block' && object.type === 'embed') {
      return <div dangerouslySetInnerHTML={{ __html: object.data.get('code') }} />;
    }
  },
  deserialize(el: Element, next) {
    if (el.tagName.toLowerCase() === 'iframe') {
      return {
        object: 'block',
        type: 'embed',
        nodes: next(el.childNodes),
        data: {
          code: el.outerHTML,
        },
      };
    }
  },
};
