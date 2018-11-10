import * as React from 'react';

import { css, cx } from 'emotion';
import * as Immutable from 'immutable';
import { debounce, isEqual } from 'lodash';
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
import SpecialCharacters from './featurePlugins/SpecialCharacters';

import schema from './schema';
import { IToolbarItem } from './toolbar';
import ToolbarDivider from './toolbar/ToolbarDivider';

const bold = Bold();
const embed = Embed();
const image = Image();
const italic = Italic();
const header = Header();
const link = Link();
const list = List();
const paragraph = Paragraph();
const specialCharacters = SpecialCharacters();
const toolbarDivider = ToolbarDivider();

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
  public editor: Slate.Editor;
  public htmlSerializer: HtmlSerializer;
  public toolbar: IToolbarItem[];
  public plugins: any[];
  public debouncedPropagateChange: () => void;

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

    let value: Slate.Value;
    if (props.value !== null) {
      value = Slate.Value.fromJSON(props.value);
    } else if (props.html) {
      value = this.htmlSerializer.deserialize(props.html);
    } else {
      value = Slate.Value.fromJSON(DEFAULT_VALUE);
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
      toolbarDivider,
      specialCharacters.toolbarItem,
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

    this.debouncedPropagateChange = debounce(this.propagateChange, 200);
  }

  public componentDidUpdate(prevProps: IProps) {
    if (
      (prevProps.value !== this.props.value &&
        !isEqual(this.props.value, this.state.value.toJSON())) ||
      (prevProps.html !== this.props.html &&
        this.props.html !== this.htmlSerializer.serialize(this.state.value))
    ) {
      let value: Slate.Value;
      if (this.props.value !== null) {
        value = Slate.Value.fromJSON(this.props.value);
      } else if (this.props.html) {
        value = this.htmlSerializer.deserialize(this.props.html);
      } else {
        value = Slate.Value.fromJSON(DEFAULT_VALUE);
      }

      this.setState({ value });
    }
  }

  public onChange = (change: {
    operations: Immutable.List<Slate.Operation>;
    value: Slate.Value;
  }) => {
    if (change.value.document !== this.state.value.document) {
      this.debouncedPropagateChange();
    }

    this.setState({ value: change.value });
  };

  public propagateChange = () => {
    this.props.onChange(this.state.value.toJSON(), this.htmlSerializer.serialize(this.state.value));
  };

  public handleToolbarCommand = (command: (editor: Slate.Editor) => void) => {
    this.editor.command(command as any);
  };

  public onPaste = (event: Event, editor: Slate.Editor, next: () => void) => {
    const transfer = getEventTransfer(event);
    if (transfer.type !== 'html') {
      return next();
    }
    const { document } = this.htmlSerializer.deserialize((transfer as any).html);
    editor.insertFragment(document);
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
                onCommand: this.handleToolbarCommand,
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
            ref={(editor) => editor && (this.editor = editor.controller)}
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
            schema={schema as any}
          />
        </div>
      </div>
    );
  }
}

const DEFAULT_VALUE: Slate.ValueJSON = {
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
};

export default RichTextEditor;
