import * as React from 'react';

import { faCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Rule } from 'slate-html-serializer';
import { RenderNodeProps } from 'slate-react';

import { IToolbarItem } from '../toolbar';

export default function Embed() {
  return {
    plugins: [
      {
        renderNode: (props: RenderNodeProps) => {
          if (props.node.type === 'embed') {
            return <EmbedNode {...props} />;
          }
        },
      },
    ],
    toolbarItem,
    htmlSerializerRule,
  };
}

function insertEmbed(change, code) {
  return change.insertBlock({
    type: 'embed',
    isVoid: true,
    data: { code },
  });
}

const toolbarItem: IToolbarItem = {
  renderItem(props) {
    const { onChange, value } = props;

    const onMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();

      const code = window.prompt('Vložte embedovaný kód (začíná většinou znaky "<iframe "):');
      if (code === null || code === '') {
        return;
      }

      const change = value.change().call(insertEmbed, code);

      onChange(change);
    };

    return (
      <span style={{ cursor: 'pointer', padding: '5px 10px' }} onMouseDown={onMouseDown}>
        <FontAwesomeIcon icon={faCode} color="#aaa" />
      </span>
    );
  },
};

const EmbedNode = (props: RenderNodeProps) => {
  const { attributes, node, isSelected } = props;

  const code = node.data.get('code');
  const style = isSelected
    ? { boxShadow: '0 0 2px', marginBottom: '1rem' }
    : { marginBottom: '1rem' };

  return <div style={style} {...attributes} dangerouslySetInnerHTML={{ __html: code }} />;
};

const htmlSerializerRule: Rule = {
  serialize(object) {
    if (object.object === 'block' && object.type === 'embed') {
      return <div dangerouslySetInnerHTML={{ __html: object.data.get('code') }} />;
    }
  },
};
