import * as React from 'react';

import * as SlateHtmlSerializer from 'slate-html-serializer';
import { RenderNodeProps } from 'slate-react';

export default function Paragraph() {
  return {
    plugins: [
      {
        renderNode: (props: RenderNodeProps, _, next: () => void) => {
          if (props.node.object === 'block' && props.node.type === 'paragraph') {
            return <ParagraphNode {...props} />;
          } else {
            return next();
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
    // descendant elements and we need descendant divs for the interactivity
    // of at least links.
    <div style={{ marginBottom: '1rem' }} {...attributes}>
      {children}
    </div>
  );
};

const htmlSerializerRule: SlateHtmlSerializer.Rule = {
  serialize: (object, children) => {
    if (object.object === 'block' && object.type === 'paragraph') {
      return <p>{children}</p>;
    }
  },
  deserialize(el, next) {
    if (el.tagName.toLowerCase() === 'p') {
      return {
        object: 'block',
        type: 'paragraph',
        nodes: next(el.childNodes),
      };
    }
  },
};
