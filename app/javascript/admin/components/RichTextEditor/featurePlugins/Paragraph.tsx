import * as React from 'react';

import { RenderNodeProps } from 'slate-react';

export default function Paragraph() {
  return {
    helpers: {},
    changes: {},
    plugins: [
      {
        renderNode: (props: RenderNodeProps) => {
          if (props.node.type === 'paragraph') {
            return <ParagraphNode {...props} />;
          }
        },
      },
    ],
    toolbar: [],
  };
}

const ParagraphNode = (props: RenderNodeProps) => {
  const { attributes, children } = props;

  // const code = node.data.get('code');
  // const style = isSelected ? { boxShadow: '0 0 2px' } : {};

  return <p {...attributes}>{children}</p>;
};
