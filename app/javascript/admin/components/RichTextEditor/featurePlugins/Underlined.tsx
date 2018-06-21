import * as React from 'react';

import { faUnderline } from '@fortawesome/free-solid-svg-icons';
import * as Slate from 'slate';
import { RenderMarkProps } from 'slate-react';

import Hotkey from '../helperPlugins/Hotkey';
import RenderMark from '../helperPlugins/RenderMark';
import RenderToolbarButton from '../helperPlugins/RenderToolbarButton';

export default function Underlined() {
  return {
    helpers: {
      hasUnderlinedMark,
    },
    changes: {
      addUnderlinedMark,
    },
    plugins: [
      Hotkey('mod+u', addUnderlinedMark),
      RenderMark('underlined', (props) => <UnderlinedMark {...props} />),
    ],
    toolbar: [RenderToolbarButton(faUnderline, addUnderlinedMark, hasUnderlinedMark)],
  };
}

const addUnderlinedMark = (change: Slate.Change) => change.toggleMark('underlined');

const hasUnderlinedMark = (value: Slate.Value) =>
  value.activeMarks.some((mark) => (mark ? mark.type === 'underlined' : false));

const UnderlinedMark = (props: RenderMarkProps) => {
  const { children, attributes } = props;

  return <u {...attributes}>{children}</u>;
};
