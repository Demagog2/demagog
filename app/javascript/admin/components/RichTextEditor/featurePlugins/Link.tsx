import * as React from 'react';

import { Colors, Icon, Popover, Position } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as copy from 'copy-to-clipboard';
import { css } from 'emotion';
import * as Slate from 'slate';
import * as SlateHtmlSerializer from 'slate-html-serializer';
import { RenderNodeProps } from 'slate-react';

import { IToolbarItem } from '../toolbar';

export default function Bold() {
  return {
    plugins: [
      {
        renderNode: (props: RenderNodeProps, _, next: () => void) => {
          if (props.node.object === 'inline' && props.node.type === 'link') {
            return <LinkNode {...props} />;
          } else {
            return next();
          }
        },
      },
    ],
    toolbarItem,
    htmlSerializerRule,
  };
}

const wrapLink = (editor: Slate.Editor, href: string) => {
  return editor
    .wrapInline({
      type: 'link',
      data: { href },
    })
    .moveToEnd();
};

const unwrapLink = (editor: Slate.Editor) => {
  return editor.unwrapInline('link');
};

const setLinkHref = (editor: Slate.Editor, href: string) => {
  return editor.setInlines({
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
    const { onCommand, value } = props;

    const onMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();

      if (hasLinks(value)) {
        const link = getLink(value);

        const href = link.data.get('href');

        const newHref = window.prompt('Vložte URL odkazu (např. https://demagog.cz/):', href);
        if (newHref === null || newHref === '') {
          return;
        }

        onCommand((editor) => {
          setLinkHref(editor, ensureProtocol(newHref));
        });
      } else if (value.selection.isExpanded) {
        const href = window.prompt('Vložte URL odkazu (např. https://demagog.cz/):');
        if (href === null || href === '') {
          return;
        }

        onCommand((editor) => {
          wrapLink(editor, ensureProtocol(href));
        });
      } else {
        const href = window.prompt('Vložte URL odkazu (např. https://demagog.cz/):');
        if (href === null || href === '') {
          return;
        }

        const text = window.prompt('Vložte text odkazu (např. Demagog):');
        if (text === null || text === '') {
          return;
        }

        onCommand((editor) => {
          editor.insertText(text).moveFocusBackward(text.length);
          wrapLink(editor, ensureProtocol(href));
        });
      }
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

  const href = (node as Slate.Inline).data.get('href');

  const onLinkMouseDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    window.open(href, '_blank');

    event.preventDefault();
    return false;
  };

  // Lets make sure the link won't open in the same window by
  // preventing default click behaviour
  const onLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    return false;
  };

  const onCopyMouseDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    copy(href);

    event.preventDefault();
    return false;
  };

  const onEditMouseDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const newHref = window.prompt('Vložte URL odkazu (např. https://demagog.cz/):', href);
    if (newHref === null || newHref === '') {
      return;
    }

    // if (editor.props.onChange) {
    //   editor.props.onChange(editor.value.change().call(setLinkHref, ensureProtocol(newHref)));
    // }
    setLinkHref(editor, ensureProtocol(newHref));

    event.preventDefault();
    return false;
  };

  const onRemoveMouseDown = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // if (editor.props.onChange) {
    //   editor.props.onChange(editor.value.change().call(unwrapLink));
    // }
    unwrapLink(editor);

    event.preventDefault();
    return false;
  };

  return (
    <Popover
      autoFocus={false}
      content={
        <div style={{ zIndex: 10000, padding: '5px 10px', maxWidth: 600 }} className="small">
          <a href={href} onMouseDown={onLinkMouseDown} onClick={onLinkClick}>
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
      isOpen={isSelected && editor.value.selection.isCollapsed}
      position={Position.BOTTOM_LEFT}
      targetClassName={css`
        /*
          Blueprint adds inline-block to the popover-target, which results
          in link not wrapping when it is long. !important is needed to
          override the Blueprint.
        */
        display: inline !important;
      `}
    >
      <a {...attributes} href={href} style={{ textDecoration: 'underline', cursor: 'text' }}>
        {children}
      </a>
    </Popover>
  );
};

const htmlSerializerRule: SlateHtmlSerializer.Rule = {
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
