import * as React from 'react';

import { faUnderline } from '@fortawesome/free-solid-svg-icons';
import * as Slate from 'slate';
import { Rule } from 'slate-html-serializer';
import { RenderMarkProps } from 'slate-react';

import Hotkey from '../helperPlugins/Hotkey';
import RenderMark from '../helperPlugins/RenderMark';
import ToolbarMarkButton from '../helperPlugins/ToolbarMarkButton';

export default function Underlined() {
  return {
    plugins: [
      Hotkey('mod+u', addUnderlinedMark),
      RenderMark('underlined', (props) => <UnderlinedMark {...props} />),
    ],
    toolbarItem: ToolbarMarkButton(faUnderline, addUnderlinedMark, hasUnderlinedMark),
    htmlSerializerRule,
  };
}

const addUnderlinedMark = (change: Slate.Change) => change.toggleMark('underlined');

const hasUnderlinedMark = (value: Slate.Value) =>
  value.activeMarks.some((mark) => (mark ? mark.type === 'underlined' : false));

const UnderlinedMark = (props: RenderMarkProps) => {
  const { children, attributes } = props;

  return <u {...attributes}>{children}</u>;
};

const htmlSerializerRule: Rule = {
  serialize(object, children) {
    if (object.object === 'mark' && object.type === 'underlined') {
      return <u>{children}</u>;
    }
  },
};
