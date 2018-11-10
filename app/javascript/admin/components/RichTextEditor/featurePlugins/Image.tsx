import * as React from 'react';

import { Colors, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as Slate from 'slate';
import * as SlateHtmlSerializer from 'slate-html-serializer';
import { RenderNodeProps } from 'slate-react';

import { IToolbarItem } from '../toolbar';

export default function Image() {
  return {
    plugins: [
      {
        renderNode: (props: RenderNodeProps, _, next: () => void) => {
          if (props.node.object === 'block' && props.node.type === 'image') {
            return <ImageNode {...props} />;
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

function insertImage(editor: Slate.Editor, src: string) {
  editor.insertBlock({
    type: 'image',
    data: { src },
  });
}

const toolbarItem: IToolbarItem = {
  renderItem(props) {
    const { onCommand } = props;

    const onMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();

      const src = window.prompt('Vložte URL obrázku:');
      if (src === null || src === '') {
        return;
      }

      onCommand((editor) => {
        insertImage(editor, src);
      });
    };

    return (
      <span
        style={{ cursor: 'pointer', display: 'inline-block', padding: '3px 10px' }}
        onMouseDown={onMouseDown}
      >
        <Icon icon={IconNames.MEDIA} color={Colors.GRAY4} />
      </span>
    );
  },
};

const ImageNode = (props: RenderNodeProps) => {
  const { attributes, node, isFocused } = props;

  const src = (node as Slate.Block).data.get('src');
  const style = {
    marginBottom: '1rem',
    maxWidth: '100%',
    boxShadow: isFocused ? '0 0 2px' : 'none',
  };

  return <img src={src} style={style} alt="" {...attributes} />;
};

const htmlSerializerRule: SlateHtmlSerializer.Rule = {
  serialize(object) {
    if (object.object === 'block' && object.type === 'image') {
      return <img src={object.data.get('src')} alt="" />;
    }
  },
  deserialize(el, next) {
    if (el.tagName.toLowerCase() === 'img') {
      return {
        object: 'block',
        type: 'image',
        nodes: next(el.childNodes),
        data: {
          src: el.getAttribute('src'),
        },
      };
    }
  },
};
