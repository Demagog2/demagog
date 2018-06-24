import * as React from 'react';

import { faItalic } from '@fortawesome/free-solid-svg-icons';
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
    toolbarItem: ToolbarMarkButton(faItalic, addItalicMark, hasItalicMark),
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
};
