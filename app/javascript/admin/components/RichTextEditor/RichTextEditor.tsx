import * as React from 'react';

import * as Slate from 'slate';
import HtmlSerializer from 'slate-html-serializer';
import { Editor } from 'slate-react';

import Bold from './featurePlugins/Bold';
import Embed from './featurePlugins/Embed';
import Image from './featurePlugins/Image';
import Italic from './featurePlugins/Italic';
import Link from './featurePlugins/Link';
import Paragraph from './featurePlugins/Paragraph';
import Underlined from './featurePlugins/Underlined';

import schema from './schema';
import { toolbarDivider } from './toolbar';

const bold = Bold();
const embed = Embed();
const image = Image();
const italic = Italic();
const link = Link();
const paragraph = Paragraph();
const underlined = Underlined();

const plugins = [
  ...bold.plugins,
  ...embed.plugins,
  ...image.plugins,
  ...italic.plugins,
  ...link.plugins,
  ...paragraph.plugins,
  ...underlined.plugins,
];

const toolbar = [
  bold.toolbarItem,
  italic.toolbarItem,
  underlined.toolbarItem,
  toolbarDivider,
  link.toolbarItem,
  toolbarDivider,
  image.toolbarItem,
  embed.toolbarItem,
];

const htmlSerializer = new HtmlSerializer({
  rules: [
    bold.htmlSerializerRule,
    embed.htmlSerializerRule,
    image.htmlSerializerRule,
    italic.htmlSerializerRule,
    link.htmlSerializerRule,
    paragraph.htmlSerializerRule,
    underlined.htmlSerializerRule,
  ],
});

interface IProps {
  value: object | null;
  onChange: (value: object, html: string) => void;
}

interface IState {
  value: Slate.Value;
}

class RichTextEditor extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      value: props.value !== null ? Slate.Value.fromJSON(props.value) : DEFAULT_VALUE,
    };
  }

  public onChange = ({ value }: Slate.Change) => {
    if (value.document !== this.state.value.document) {
      this.props.onChange(value.toJSON(), htmlSerializer.serialize(value));
    }

    this.setState({ value });
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
          {toolbar.map((item, index) => (
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
            plugins={plugins}
            spellCheck
            style={{
              minHeight: '200px',
            }}
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
