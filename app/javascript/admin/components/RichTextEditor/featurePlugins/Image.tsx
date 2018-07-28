import * as React from 'react';

import { Colors, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Rule } from 'slate-html-serializer';
import { RenderNodeProps } from 'slate-react';

import { IToolbarItem } from '../toolbar';

export default function Image() {
  return {
    plugins: [
      {
        renderNode: (props: RenderNodeProps) => {
          if (props.node.type === 'image') {
            return <ImageNode {...props} />;
          }
        },
      },
    ],
    toolbarItem,
    htmlSerializerRule,
  };
}

function insertImage(change, src) {
  return change.insertBlock({
    type: 'image',
    isVoid: true,
    data: { src },
  });
}

const toolbarItem: IToolbarItem = {
  renderItem(props) {
    const { onChange, value } = props;

    const onMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();

      const src = window.prompt('Vložte URL obrázku:');
      if (src === null || src === '') {
        return;
      }

      const change = value.change().call(insertImage, src);

      onChange(change);
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
  const { attributes, node, isSelected } = props;

  const src = node.data.get('src');
  const style = {
    marginBottom: '1rem',
    maxWidth: '100%',
    boxShadow: isSelected ? '0 0 2px' : 'none',
  };

  return <img src={src} style={style} alt="" {...attributes} />;
};

const htmlSerializerRule: Rule = {
  serialize(object) {
    if (object.object === 'block' && object.type === 'image') {
      return <img src={object.data.get('src')} alt="" />;
    }
  },
};
