import * as React from 'react';

import { IconNames } from '@blueprintjs/icons';
import * as Slate from 'slate';
import * as SlateHtmlSerializer from 'slate-html-serializer';
import { RenderMarkProps } from 'slate-react';

import Hotkey from '../helperPlugins/Hotkey';
import RenderMark from '../helperPlugins/RenderMark';
import MarkButtonToolbarItem from '../toolbar/MarkButtonToolbarItem';

export default function Bold() {
  return {
    plugins: [
      Hotkey('mod+b', toggleBoldMark),
      RenderMark('bold', (props) => <BoldMark {...props} />),
    ],
    toolbarItem: MarkButtonToolbarItem(IconNames.BOLD, toggleBoldMark, hasBoldMark),
    htmlSerializerRule,
  };
}

const toggleBoldMark = (editor: Slate.Editor) => editor.toggleMark('bold');

const hasBoldMark = (value: Slate.Value) =>
  value.activeMarks.some((mark) => (mark ? mark.type === 'bold' : false));

const BoldMark = (props: RenderMarkProps) => {
  const { children, attributes } = props;

  return <strong {...attributes}>{children}</strong>;
};

const htmlSerializerRule: SlateHtmlSerializer.Rule = {
  serialize(object, children) {
    if (object.object === 'mark' && object.type === 'bold') {
      return <strong>{children}</strong>;
    }
  },
  deserialize(el: HTMLElement, next) {
    // Google Docs wraps copied text in <b style="font-weight: normal;"></b> even
    // when the text is not bold, so lets ignore such b tag
    const isValidBTag = el.tagName.toLowerCase() === 'b' && el.style.fontWeight !== 'normal';

    const isStrongTag = el.tagName.toLowerCase() === 'strong';

    // Google Docs does not use semantic <b> or <strong> for bold text, but <span> with
    // font-weight style attribute
    const isValidSpanTag =
      el.tagName.toLowerCase() === 'span' &&
      el.style.fontWeight !== null &&
      el.style.fontWeight.match(/^(700|900|bold|bolder)$/);

    if (isValidBTag || isStrongTag || isValidSpanTag) {
      return {
        object: 'mark',
        type: 'bold',
        nodes: next(el.childNodes),
      };
    }
  },
};
