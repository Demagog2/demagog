import * as React from 'react';

import { IconNames } from '@blueprintjs/icons';
import * as Slate from 'slate';
import * as SlateHtmlSerializer from 'slate-html-serializer';
import { RenderMarkProps } from 'slate-react';

import Hotkey from '../helperPlugins/Hotkey';
import RenderMark from '../helperPlugins/RenderMark';
import MarkButtonToolbarItem from '../toolbar/MarkButtonToolbarItem';

export default function Italic() {
  return {
    plugins: [
      Hotkey('mod+i', toggleItalicMark),
      RenderMark('italic', (props) => <ItalicMark {...props} />),
    ],
    toolbarItem: MarkButtonToolbarItem(IconNames.ITALIC, toggleItalicMark, hasItalicMark),
    htmlSerializerRule,
  };
}

const toggleItalicMark = (editor: Slate.Editor) => editor.toggleMark('italic');

const hasItalicMark = (value: Slate.Value) =>
  value.activeMarks.some((mark) => (mark ? mark.type === 'italic' : false));

const ItalicMark = (props: RenderMarkProps) => {
  const { children, attributes } = props;

  return <em {...attributes}>{children}</em>;
};

const htmlSerializerRule: SlateHtmlSerializer.Rule = {
  serialize(object, children) {
    if (object.object === 'mark' && object.type === 'italic') {
      return <em>{children}</em>;
    }
  },
  deserialize(el: HTMLElement, next) {
    const isITag = el.tagName.toLowerCase() === 'i';
    const isEmTag = el.tagName.toLowerCase() === 'em';

    // Google Docs does not use semantic <i> or <em> for italic text, but <span> with
    // font-style:italic style attribute
    const isValidSpanTag = el.tagName.toLowerCase() === 'span' && el.style.fontStyle === 'italic';

    if (isITag || isEmTag || isValidSpanTag) {
      return {
        object: 'mark',
        type: 'italic',
        nodes: next(el.childNodes),
      };
    }
  },
};
