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

  return (
    // Using <div> element, not <p>, because <p> cannot have non-text
    // descendant elements and we need descendant dics for the interactivity
    // of at least links.
    <div style={{ marginBottom: '1rem' }} {...attributes}>
      {children}
    </div>
  );
};
