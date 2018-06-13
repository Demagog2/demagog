import * as React from 'react';

import * as Slate from 'slate';
import Plain from 'slate-plain-serializer';
import { Editor } from 'slate-react';

interface ITextInputProps {
  className?: string;
  defaultValue?: string | null;
  placeholder: string;
  onChange(evt: any): void;
}

interface ITextInputState {
  value: Slate.Value;
}

export class TextInput extends React.Component<ITextInputProps, ITextInputState> {
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
        style={{ minHeight: 320 }}
      >
        <label>Přepis:</label>

        <Editor
          placeholder={this.props.placeholder}
          value={this.state.value}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
