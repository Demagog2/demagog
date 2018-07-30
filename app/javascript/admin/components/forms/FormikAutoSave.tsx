import * as React from 'react';

import { isEqual } from 'lodash';

interface IProps {
  submitForm: any;
  values: any;
  initialValues: any;
}

class FormikAutoSave extends React.Component<IProps> {
  public componentDidUpdate(prevProps: IProps) {
    if (
      !isEqual(prevProps.values, this.props.values) &&
      !isEqual(this.props.values, this.props.initialValues)
    ) {
      this.props.submitForm();
    }
  }

  public render() {
    return null;
  }
}

export default FormikAutoSave;
