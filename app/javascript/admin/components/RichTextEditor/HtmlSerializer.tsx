import * as React from 'react';

import * as Slate from 'slate';
import Html from 'slate-html-serializer';

interface IRule {
  serialize: (
    object: Slate.Node | Slate.Mark | { object: 'string'; text: string },
    children: any,
  ) => JSX.Element | void;
}

const rules: IRule[] = [
  {
    serialize: (object, children) => {
      if (object.object === 'string') {
        return children.split('\n').reduce((array, text, i) => {
          if (i !== 0) {
            array.push(<br key={i} />);
          }
          array.push(text);
          return array;
        }, []);
      }
    },
  },
  {
    serialize: (object, children) => {
      if (object.object === 'block' && object.type === 'paragraph') {
        return <p>{children}</p>;
      }
    },
  },
  {
    serialize: (object, children) => {
      if (object.object === 'mark') {
        switch (object.type) {
          case 'bold':
            return <strong>{children}</strong>;
          case 'italic':
            return <em>{children}</em>;
          case 'underlined':
            return <u>{children}</u>;
        }
      }
    },
  },
];

export default new Html({ rules });
