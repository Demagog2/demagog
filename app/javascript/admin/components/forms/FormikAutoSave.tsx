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
      // Needs to be run in next tick, see https://github.com/jaredpalmer/formik/issues/1218
      // Also consider updating to Formik v2 which have recommended autosave component
      window.setTimeout(() => this.props.submitForm(), 0);
    }
  }

  public render() {
    return null;
  }
}

export default FormikAutoSave;
