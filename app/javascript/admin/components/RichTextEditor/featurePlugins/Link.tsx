import * as React from 'react';

import { Popover, Position } from '@blueprintjs/core';
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

const setLinkHref = (change: Slate.Change, href: string) => {
  return change.setInlines({
    type: 'link',
    data: { href },
  });
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
  const { children, attributes, node, isSelected, editor } = props;

  const href = node.data.get('href');

  const onLinkMouseDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.open(href, '_blank');
  };

  const onEditMouseDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const newHref = window.prompt('Vložte URL odkazu (např. https://demagog.cz/):', href);
    if (newHref === null || newHref === '') {
      return;
    }

    if (editor.props.onChange) {
      editor.props.onChange((editor.value.change() as any).call(setLinkHref, newHref));
    }
  };

  const onRemoveMouseDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    if (editor.props.onChange) {
      editor.props.onChange(editor.value.change().call(unwrapLink));
    }
  };

  return (
    <Popover
      autoFocus={false}
      content={
        <div style={{ zIndex: 10000, padding: '5px 10px', maxWidth: 400 }} className="small">
          <a href={href} onMouseDown={onLinkMouseDown}>
            {href}
          </a>{' '}
          –{' '}
          <a href="#" onMouseDown={onEditMouseDown}>
            Změnit
          </a>{' '}
          |{' '}
          <a href="#" onMouseDown={onRemoveMouseDown}>
            Odstranit
          </a>
        </div>
      }
      isOpen={isSelected}
      position={Position.BOTTOM_LEFT}
    >
      <a {...attributes} href={href} style={{ textDecoration: 'underline', cursor: 'text' }}>
        {children}
      </a>
    </Popover>
  );
};
