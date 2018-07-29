import * as React from 'react';

import { css, cx } from 'emotion';
import * as Slate from 'slate';
import HtmlSerializer from 'slate-html-serializer';
import { Editor, getEventTransfer } from 'slate-react';
import SoftBreak from 'slate-soft-break';

import Bold from './featurePlugins/Bold';
import Embed from './featurePlugins/Embed';
import Header from './featurePlugins/Header';
import Image from './featurePlugins/Image';
import Italic from './featurePlugins/Italic';
import Link from './featurePlugins/Link';
import List from './featurePlugins/List';
import Paragraph from './featurePlugins/Paragraph';

import schema from './schema';
import { IToolbarItem, toolbarDivider } from './toolbar';

const bold = Bold();
const embed = Embed();
const image = Image();
const italic = Italic();
const header = Header();
const link = Link();
const list = List();
const paragraph = Paragraph();

interface IProps {
  value: object | null;
  onChange: (value: object, html: string) => void;
  className?: string;
  statementExplanation?: boolean;
  html?: string | null;
}

interface IState {
  value: Slate.Value;
}

class RichTextEditor extends React.Component<IProps, IState> {
  public htmlSerializer: HtmlSerializer;
  public toolbar: IToolbarItem[];
  public plugins: any[];

  constructor(props: IProps) {
    super(props);

    this.htmlSerializer = new HtmlSerializer({
      rules: [
        bold.htmlSerializerRule,
        embed.htmlSerializerRule,
        ...(props.statementExplanation ? [] : [header.htmlSerializerRule]),
        image.htmlSerializerRule,
        italic.htmlSerializerRule,
        link.htmlSerializerRule,
        list.htmlSerializerRule,
        paragraph.htmlSerializerRule,
      ],
    });

    let value;
    if (props.value !== null) {
      value = Slate.Value.fromJSON(props.value);
    } else if (props.html) {
      value = this.htmlSerializer.deserialize(props.html);
    } else {
      value = DEFAULT_VALUE;
    }

    this.state = {
      value,
    };

    this.toolbar = [
      bold.toolbarItem,
      italic.toolbarItem,
      toolbarDivider,
      ...(props.statementExplanation ? [] : [header.toolbarItem, toolbarDivider]),
      link.toolbarItem,
      toolbarDivider,
      ...list.toolbarItems,
      toolbarDivider,
      image.toolbarItem,
      embed.toolbarItem,
    ];

    this.plugins = [
      SoftBreak({
        shift: true,
      }),

      ...bold.plugins,
      ...embed.plugins,
      ...(props.statementExplanation ? [] : header.plugins),
      ...image.plugins,
      ...italic.plugins,
      ...link.plugins,
      ...list.plugins,
      ...paragraph.plugins,
    ];
  }

  public onChange = ({ value }: Slate.Change) => {
    if (value.document !== this.state.value.document) {
      this.props.onChange(value.toJSON(), this.htmlSerializer.serialize(value));
    }

    this.setState({ value });
  };

  public onPaste = (event: Event, change: Slate.Change) => {
    const transfer = getEventTransfer(event);
    if (transfer.type !== 'html') {
      return;
    }
    const { document } = this.htmlSerializer.deserialize((transfer as any).html);
    change.insertFragment(document);
    return true;
  };

  public render() {
    return (
      <div>
        <div
          style={{
            padding: '6px 5px',
            border: '1px solid #ced4da',
            borderBottom: 'none',
            borderRadius: '.25rem .25rem 0 0',
          }}
        >
          {this.toolbar.map((item, index) => (
            <span key={index}>
              {item.renderItem({
                onChange: this.onChange,
                value: this.state.value,
              })}
            </span>
          ))}
        </div>

        <div
          style={{
            padding: 10,
            border: '1px solid #ced4da',
            borderRadius: '0 0 .25rem .25rem',
          }}
        >
          <Editor
            value={this.state.value}
            onChange={this.onChange}
            onPaste={this.onPaste}
            plugins={this.plugins}
            spellCheck
            className={cx(
              this.props.className,
              css`
                min-height: 200px;
              `,
            )}
            schema={schema}
          />
        </div>
      </div>
    );
  }
}

const DEFAULT_VALUE = Slate.Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: '',
              },
            ],
          },
        ],
      },
    ],
  },
});

export default RichTextEditor;
