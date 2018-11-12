import * as React from 'react';
import Select from 'react-select';

import { ASSESSMENT_STATUS_LABELS } from '../../../constants';

interface ISelectOption {
  value: string;
  label: string;
}

const OPTIONS: ISelectOption[] = Object.keys(ASSESSMENT_STATUS_LABELS).map((value) => ({
  value,
  label: ASSESSMENT_STATUS_LABELS[value],
}));

interface IProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export default class EvaluationStatusSelect extends React.Component<IProps> {
  public render() {
    return (
      <Select<ISelectOption>
        value={OPTIONS.filter(({ value }) => value === this.props.value)}
        options={OPTIONS}
        onChange={(selectedOption) => {
          if (selectedOption) {
            this.props.onChange((selectedOption as ISelectOption).value);
          }
        }}
        onBlur={this.props.onBlur}
        placeholder="Vyberte …"
        isClearable
      />
    );
  }
}
