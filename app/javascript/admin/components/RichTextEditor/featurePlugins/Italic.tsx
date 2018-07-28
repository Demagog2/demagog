import * as React from 'react';

import { IconNames } from '@blueprintjs/icons';
import * as Slate from 'slate';
import { Rule } from 'slate-html-serializer';
import { RenderMarkProps } from 'slate-react';

import Hotkey from '../helperPlugins/Hotkey';
import RenderMark from '../helperPlugins/RenderMark';
import ToolbarMarkButton from '../helperPlugins/ToolbarMarkButton';

export default function Italic() {
  return {
    plugins: [
      Hotkey('mod+i', addItalicMark),
      RenderMark('italic', (props) => <ItalicMark {...props} />),
    ],
    toolbarItem: ToolbarMarkButton(IconNames.ITALIC, addItalicMark, hasItalicMark),
    htmlSerializerRule,
  };
}

const addItalicMark = (change: Slate.Change) => change.toggleMark('italic');

const hasItalicMark = (value: Slate.Value) =>
  value.activeMarks.some((mark) => (mark ? mark.type === 'italic' : false));

const ItalicMark = (props: RenderMarkProps) => {
  const { children, attributes } = props;

  return <em {...attributes}>{children}</em>;
};

const htmlSerializerRule: Rule = {
  serialize(object, children) {
    if (object.object === 'mark' && object.type === 'italic') {
      return <em>{children}</em>;
    }
  },
  deserialize(el, next) {
    if (el.tagName.toLowerCase() === 'i' || el.tagName.toLowerCase() === 'em') {
      return {
        object: 'mark',
        type: 'italic',
        nodes: next(el.childNodes),
      };
    }
  },
};
