import * as React from 'react';
import Select from 'react-select';

import { ASSESSMENT_STATUS_LABELS } from '../../../constants';

const OPTIONS = Object.keys(ASSESSMENT_STATUS_LABELS).map((value) => ({
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
      <Select
        value={this.props.value || undefined}
        options={OPTIONS}
        onChange={(option: { value: string }) => this.props.onChange(option.value)}
        onBlur={this.props.onBlur}
        placeholder="Vyberte …"
      />
    );
  }
}
