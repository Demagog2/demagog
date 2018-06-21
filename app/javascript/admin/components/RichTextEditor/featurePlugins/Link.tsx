import * as React from 'react';

import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Slate from 'slate';
import { RenderNodeProps } from 'slate-react';

import { IRenderToolbarButtonProps } from '../helperPlugins/RenderToolbarButton';

export default function Bold() {
  return {
    helpers: {
      hasLinks,
    },
    changes: {
      wrapLink,
      unwrapLink,
    },
    plugins: [
      {
        renderNode: (props: RenderNodeProps) => {
          if (props.node.type === 'link') {
            return <LinkNode {...props} />;
          }
        },
      },
    ],
    toolbar: [
      {
        renderToolbarButton,
      },
    ],
  };
}

const wrapLink = (change: Slate.Change, href: string) => {
  return change
    .wrapInline({
      type: 'link',
      data: { href },
    })
    .collapseToEnd();
};

const unwrapLink = (change: Slate.Change) => {
  return change.unwrapInline('link');
};

const hasLinks = (value: Slate.Value) =>
  value.inlines.some((inline) => (inline ? inline.type === 'link' : false));

const renderToolbarButton = (props: IRenderToolbarButtonProps) => {
  const { onChange, value } = props;

  const onMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    const change = value.change();

    if (hasLinks(value)) {
      change.call(unwrapLink);
    } else if (value.isExpanded) {
      const href = window.prompt('Vložte URL odkazu (např. https://demagog.cz/):') || '';
      (change as any).call(wrapLink, href);
    } else {
      const href = window.prompt('Vložte URL odkazu (např. https://demagog.cz/):');
      if (href === null || href === '') {
        return;
      }

      const text = window.prompt('Vložte text odkazu (např. Demagog):');
      if (text === null || text === '') {
        return;
      }

      (change as any)
        .insertText(text)
        .extend(0 - text.length)
        .call(wrapLink, href);
    }

    onChange(change);
  };

  return (
    <span style={{ cursor: 'pointer', padding: '5px 10px' }} onMouseDown={onMouseDown}>
      <FontAwesomeIcon icon={faLink} color="#aaa" />
    </span>
  );
};

const LinkNode = (props: RenderNodeProps) => {
  const { children, attributes, node } = props;

  const href = node.data.get('href');

  return (
    <a {...attributes} href={href} style={{ textDecoration: 'underline', cursor: 'text' }}>
      {children}
    </a>
  );
};
