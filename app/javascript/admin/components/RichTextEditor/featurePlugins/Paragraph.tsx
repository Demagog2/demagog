import * as React from 'react';

import { Rule } from 'slate-html-serializer';
import { RenderNodeProps } from 'slate-react';

export default function Paragraph() {
  return {
    plugins: [
      {
        renderNode: (props: RenderNodeProps) => {
          if (props.node.type === 'paragraph') {
            return <ParagraphNode {...props} />;
          }
        },
      },
    ],
    htmlSerializerRule,
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

const htmlSerializerRule: Rule = {
  serialize: (object, children) => {
    if (object.object === 'block' && object.type === 'paragraph') {
      return <p>{children}</p>;
    }
  },
};
