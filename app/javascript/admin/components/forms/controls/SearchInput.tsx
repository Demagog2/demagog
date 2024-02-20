import * as React from 'react';

import { Classes, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as classNames from 'classnames';
import { debounce } from 'lodash';

interface IProps {
  placeholder: string;
  value: string;
  autoFocus?: boolean;
  onChange: (value: string) => void;
}

interface IState {
  value: string;
}

export class SearchInput extends React.Component<IProps, IState> {
  public debouncedOnChange = debounce((value: string) => {
    this.props.onChange(value);
  }, 500);

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value,
    };
  }

  public componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      this.setState({ value: this.props.value });
    }
  }

  public onInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ value: e.currentTarget.value }, () => {
      this.debouncedOnChange(this.state.value);
    });
  };

  public render() {
    const { placeholder, autoFocus } = this.props;
    const { value } = this.state;

    return (
      <div className={classNames(Classes.INPUT_GROUP)}>
        <Icon icon={IconNames.SEARCH} />
        <input
          className={Classes.INPUT}
          type="search"
          placeholder={placeholder}
          dir="auto"
          value={value}
          onChange={this.onInputChange}
          autoFocus={autoFocus}
        />
      </div>
    );
  }
}
