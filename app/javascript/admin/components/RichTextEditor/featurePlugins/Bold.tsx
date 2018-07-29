import * as React from 'react';

import { IconNames } from '@blueprintjs/icons';
import * as Slate from 'slate';
import { Rule } from 'slate-html-serializer';
import { RenderMarkProps } from 'slate-react';

import Hotkey from '../helperPlugins/Hotkey';
import RenderMark from '../helperPlugins/RenderMark';
import ToolbarMarkButton from '../helperPlugins/ToolbarMarkButton';

export default function Bold() {
  return {
    plugins: [Hotkey('mod+b', addBoldMark), RenderMark('bold', (props) => <BoldMark {...props} />)],
    toolbarItem: ToolbarMarkButton(IconNames.BOLD, addBoldMark, hasBoldMark),
    htmlSerializerRule,
  };
}

const addBoldMark = (change: Slate.Change) => change.toggleMark('bold');

const hasBoldMark = (value: Slate.Value) =>
  value.activeMarks.some((mark) => (mark ? mark.type === 'bold' : false));

const BoldMark = (props: RenderMarkProps) => {
  const { children, attributes } = props;

  return <strong {...attributes}>{children}</strong>;
};

const htmlSerializerRule: Rule = {
  serialize(object, children) {
    if (object.object === 'mark' && object.type === 'bold') {
      return <strong>{children}</strong>;
    }
  },
  deserialize(el, next) {
    if (el.tagName.toLowerCase() === 'b' || el.tagName.toLowerCase() === 'strong') {
      return {
        object: 'mark',
        type: 'bold',
        nodes: next(el.childNodes),
      };
    }
  },
};
