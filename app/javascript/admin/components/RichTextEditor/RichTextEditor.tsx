import * as React from 'react';

import * as Slate from 'slate';
import { Editor } from 'slate-react';

import Bold from './featurePlugins/Bold';
import Italic from './featurePlugins/Italic';
import Underlined from './featurePlugins/Underlined';

const bold = Bold();
const italic = Italic();
const underlined = Underlined();

const plugins = [...bold.plugins, ...italic.plugins, ...underlined.plugins];

const toolbarDivider = {
  renderToolbarButton() {
    return (
      <span
        style={{
          borderLeft: '1px solid #ced4da',
          marginTop: -6,
          marginBottom: -12,
          marginLeft: 5,
          marginRight: 5,
          display: 'inline-block',
          height: 36,
        }}
      />
    );
  },
};
const toolbar = [...bold.toolbar, ...italic.toolbar, ...underlined.toolbar, toolbarDivider];

interface IProps {
  value: object | null;
  onChange: (value: object) => void;
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
      this.props.onChange(value.toJSON());
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
          {toolbar.map((item) =>
            item.renderToolbarButton({
              onChange: this.onChange,
              value: this.state.value,
            }),
          )}
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
            style={{ minHeight: '200px' }}
          />
        </div>
      </div>
    );
  }
}

// TODO
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
                text: 'A line of text in a paragraph.',
              },
            ],
          },
        ],
      },
    ],
  },
});

export default RichTextEditor;
