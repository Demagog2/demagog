import * as React from 'react';

import { faItalic } from '@fortawesome/free-solid-svg-icons';
import * as Slate from 'slate';
import { RenderMarkProps } from 'slate-react';

import Hotkey from '../helperPlugins/Hotkey';
import RenderMark from '../helperPlugins/RenderMark';
import RenderToolbarButton from '../helperPlugins/RenderToolbarButton';

export default function Italic() {
  return {
    helpers: {
      hasItalicMark,
    },
    changes: {
      addItalicMark,
    },
    plugins: [
      Hotkey('mod+i', addItalicMark),
      RenderMark('italic', (props) => <ItalicMark {...props} />),
    ],
    toolbar: [RenderToolbarButton(faItalic, addItalicMark, hasItalicMark)],
  };
}

const addItalicMark = (change: Slate.Change) => change.toggleMark('italic');

const hasItalicMark = (value: Slate.Value) =>
  value.activeMarks.some((mark) => (mark ? mark.type === 'italic' : false));

const ItalicMark = (props: RenderMarkProps) => {
  const { children, attributes } = props;

  return <em {...attributes}>{children}</em>;
};
