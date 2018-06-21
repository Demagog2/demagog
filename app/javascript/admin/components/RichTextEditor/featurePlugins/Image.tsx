import * as React from 'react';

import { faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RenderNodeProps } from 'slate-react';

import { IRenderToolbarButtonProps } from '../helperPlugins/RenderToolbarButton';

export default function Image() {
  return {
    helpers: {},
    changes: {},
    plugins: [
      {
        renderNode: (props: RenderNodeProps) => {
          if (props.node.type === 'image') {
            return <ImageNode {...props} />;
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

function insertImage(change, src) {
  return change.insertBlock({
    type: 'image',
    isVoid: true,
    data: { src },
  });
}

const renderToolbarButton = (props: IRenderToolbarButtonProps) => {
  const { onChange, value } = props;

  const onMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();

    const src = window.prompt('Vložte URL obrázku:');
    if (src === null || src === '') {
      return;
    }

    const change = (value.change() as any).call(insertImage, src);

    onChange(change);
  };

  return (
    <span style={{ cursor: 'pointer', padding: '5px 10px' }} onMouseDown={onMouseDown}>
      <FontAwesomeIcon icon={faImage} color="#aaa" />
    </span>
  );
};

const ImageNode = (props: RenderNodeProps) => {
  const { attributes, node, isSelected } = props;

  const src = node.data.get('src');
  const style = isSelected
    ? { boxShadow: '0 0 2px', marginBottom: '1rem' }
    : { marginBottom: '1rem' };

  return <img src={src} style={style} alt="" {...attributes} />;
};
