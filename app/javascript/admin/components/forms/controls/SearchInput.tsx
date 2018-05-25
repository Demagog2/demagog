import * as React from 'react';

import { debounce } from 'lodash';

interface ISearchInputProps {
  marginBottom?: number;
  placeholder: string;
  onChange(value: string): void;
}

export class SearchInput extends React.Component<ISearchInputProps> {
  public static defaultProps = {
    marginBottom: 20,
  };

  private debouncedOnChange = debounce((value: string) => this.props.onChange(value), 500);

  public render() {
    const { marginBottom, placeholder } = this.props;

    return (
      <input
        style={{ marginBottom }}
        className="form-control"
        type="search"
        placeholder={placeholder}
        onChange={this.onChange}
      />
    );
  }

  private onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.debouncedOnChange(evt.target.value);
  };
}
