import * as React from 'react';

import { faBold } from '@fortawesome/free-solid-svg-icons';
import * as Slate from 'slate';
import { RenderMarkProps } from 'slate-react';

import Hotkey from '../helperPlugins/Hotkey';
import RenderMark from '../helperPlugins/RenderMark';
import RenderToolbarButton from '../helperPlugins/RenderToolbarButton';

export default function Bold() {
  return {
    helpers: {
      hasBoldMark,
    },
    changes: {
      addBoldMark,
    },
    plugins: [Hotkey('mod+b', addBoldMark), RenderMark('bold', (props) => <BoldMark {...props} />)],
    toolbar: [RenderToolbarButton(faBold, addBoldMark, hasBoldMark)],
  };
}

const addBoldMark = (change: Slate.Change) => change.toggleMark('bold');

const hasBoldMark = (value: Slate.Value) =>
  value.activeMarks.some((mark) => (mark ? mark.type === 'bold' : false));

const BoldMark = (props: RenderMarkProps) => {
  const { children, attributes } = props;

  return <strong {...attributes}>{children}</strong>;
};
