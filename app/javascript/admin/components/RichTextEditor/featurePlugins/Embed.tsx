import * as React from 'react';

import { faCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import * as Slate from 'slate';
import { RenderNodeProps } from 'slate-react';

import { IRenderToolbarButtonProps } from '../helperPlugins/RenderToolbarButton';

export default function Bold() {
  return {
    helpers: {},
    changes: {},
    plugins: [
      {
        renderNode: (props: RenderNodeProps) => {
          if (props.node.type === 'embed') {
            return <EmbedNode {...props} />;
          }
        },
      },
    ],
    toolbar: [
      {
        renderToolbarButton,
      },
    ],
  };
}

function insertEmbed(change, code) {
  return change.insertBlock({
    type: 'embed',
    isVoid: true,
    data: { code },
  });
}

const renderToolbarButton = (props: IRenderToolbarButtonProps) => {
  const { onChange, value } = props;

  const onMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();

    const code = window.prompt('Vložte embedovaný kód (začíná většinou znaky "<iframe "):');
    if (code === null || code === '') {
      return;
    }

    const change = (value.change() as any).call(insertEmbed, code);

    onChange(change);
  };

  return (
    <span style={{ cursor: 'pointer', padding: '5px 10px' }} onMouseDown={onMouseDown}>
      <FontAwesomeIcon icon={faCode} color="#aaa" />
    </span>
  );
};

const EmbedNode = (props: RenderNodeProps) => {
  const { attributes, node, isSelected } = props;

  const code = node.data.get('code');
  const style = isSelected ? { boxShadow: '0 0 2px' } : {};

  return <div style={style} {...attributes} dangerouslySetInnerHTML={{ __html: code }} />;
};
