import * as React from 'react';

import * as Slate from 'slate';
import Plain from 'slate-plain-serializer';
import { Editor } from 'slate-react';

interface IEditorChangeEvent {
  target: {
    value: string;
  };
}

interface ITextInputProps {
  className?: string;
  label: string;
  defaultValue?: string | null;
  minHeight?: number;
  placeholder: string;
  onChange(evt: IEditorChangeEvent): void;
}

interface ITextInputState {
  value: Slate.Value;
}

export class TextInput extends React.Component<ITextInputProps, ITextInputState> {
  public static defaultProps: Partial<ITextInputProps> = {
    minHeight: 320,
  };

  constructor(props: ITextInputProps) {
    super(props);

    this.state = {
      value: Plain.deserialize(props.defaultValue || ''),
    };
  }

  public onChange = ({ value }) => {
    const content = Plain.serialize(value);

    this.props.onChange({ target: { value: content } });

    this.setState({ value });
  };

  public render() {
    return (
      <div
        className={`form-group ${this.props.className ? this.props.className : ''}`}
        style={{ minHeight: this.props.minHeight }}
      >
        <label>{this.props.label}</label>

        <div
          style={{
            overflow: 'scroll',
            border: '1px solid #ced4da',
            borderRadius: '.25rem',
            padding: 10,
          }}
        >
          <Editor
            placeholder={this.props.placeholder}
            value={this.state.value}
            onChange={this.onChange}
            style={{ minHeight: `${this.props.minHeight}px` }}
          />
        </div>
      </div>
    );
  }
}
