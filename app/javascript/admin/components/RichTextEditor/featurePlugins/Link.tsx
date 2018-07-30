import * as React from 'react';

import { Colors, Icon, Popover, Position } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as copy from 'copy-to-clipboard';
import * as Slate from 'slate';
import { Rule } from 'slate-html-serializer';
import { RenderNodeProps } from 'slate-react';

import { IToolbarItem } from '../toolbar';

export default function Bold() {
  return {
    plugins: [
      {
        renderNode: (props: RenderNodeProps) => {
          if (props.node.type === 'link') {
            return <LinkNode {...props} />;
          }
        },
      },
    ],
    toolbarItem,
    htmlSerializerRule,
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

const getLink = (value: Slate.Value) =>
  value.inlines.find((inline) => (inline ? inline.type === 'link' : false));

const ensureProtocol = (href: string) => {
  if (!href.startsWith('http') && !href.startsWith('mailto:')) {
    return 'http://' + href;
  }

  return href;
};

const toolbarItem: IToolbarItem = {
  renderItem(props) {
    const { onChange, value } = props;

    const onMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      const change = value.change();

      if (hasLinks(value)) {
        const link = getLink(value);

        const href = link.data.get('href');

        const newHref = window.prompt('Vložte URL odkazu (např. https://demagog.cz/):', href);
        if (newHref === null || newHref === '') {
          return;
        }

        change.call(setLinkHref, ensureProtocol(newHref));
      } else if (value.isExpanded) {
        const href = window.prompt('Vložte URL odkazu (např. https://demagog.cz/):');
        if (href === null || href === '') {
          return;
        }

        change.call(wrapLink, ensureProtocol(href));
      } else {
        const href = window.prompt('Vložte URL odkazu (např. https://demagog.cz/):');
        if (href === null || href === '') {
          return;
        }

        const text = window.prompt('Vložte text odkazu (např. Demagog):');
        if (text === null || text === '') {
          return;
        }

        change
          .insertText(text)
          .extend(0 - text.length)
          .call(wrapLink, ensureProtocol(href));
      }

      onChange(change);
    };

    return (
      <span
        style={{ cursor: 'pointer', display: 'inline-block', padding: '3px 10px' }}
        onMouseDown={onMouseDown}
      >
        <Icon icon={IconNames.LINK} color={Colors.GRAY4} />
      </span>
    );
  },
};

const LinkNode = (props: RenderNodeProps) => {
  const { children, attributes, node, isSelected, editor } = props;

  const href = node.data.get('href');

  const onLinkMouseDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    window.open(href, '_blank');
  };

  const onCopyMouseDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    copy(href);
  };

  const onEditMouseDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const newHref = window.prompt('Vložte URL odkazu (např. https://demagog.cz/):', href);
    if (newHref === null || newHref === '') {
      return;
    }

    if (editor.props.onChange) {
      editor.props.onChange(editor.value.change().call(setLinkHref, ensureProtocol(newHref)));
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
        <div style={{ zIndex: 10000, padding: '5px 10px', maxWidth: 600 }} className="small">
          <a href={href} onMouseDown={onLinkMouseDown}>
            {href}
          </a>{' '}
          –{' '}
          <a href="#" onMouseDown={onCopyMouseDown}>
            Kopírovat odkaz
          </a>
          {' | '}
          <a href="#" onMouseDown={onEditMouseDown}>
            Změnit
          </a>
          {' | '}
          <a href="#" onMouseDown={onRemoveMouseDown}>
            Odstranit
          </a>
        </div>
      }
      isOpen={isSelected && editor.value.isCollapsed}
      position={Position.BOTTOM_LEFT}
    >
      <a {...attributes} href={href} style={{ textDecoration: 'underline', cursor: 'text' }}>
        {children}
      </a>
    </Popover>
  );
};

const htmlSerializerRule: Rule = {
  serialize(object, children) {
    if (object.object === 'inline' && object.type === 'link') {
      return <a href={object.data.get('href')}>{children}</a>;
    }
  },
  deserialize(el, next) {
    if (el.tagName.toLowerCase() === 'a') {
      return {
        object: 'inline',
        type: 'link',
        nodes: next(el.childNodes),
        data: {
          href: el.getAttribute('href'),
        },
      };
    }
  },
};
