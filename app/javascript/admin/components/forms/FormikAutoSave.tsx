import * as React from 'react';

import { debounce, isEqual } from 'lodash';

interface IProps {
  debounceWait: number;
  submitForm: any;
  values: any;
}

class FormikAutoSave extends React.Component<IProps> {
  public submit = debounce(() => {
    this.props.submitForm();
  }, this.props.debounceWait);

  public componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.values, this.props.values)) {
      this.submit();
    }
  }

  public render() {
    return null;
  }
}

export default FormikAutoSave;
