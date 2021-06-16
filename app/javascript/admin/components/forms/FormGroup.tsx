import * as React from 'react';

import {
  Classes,
  FormGroup as BlueprintFormGroup,
  IFormGroupProps as IBlueprintFormGroupProps,
  Intent,
} from '@blueprintjs/core';
import { Field, getIn } from 'formik';

interface IFormGroupProps extends IBlueprintFormGroupProps {
  error?: object | false;
  optional?: boolean;
  children?: JSX.Element;
}

class FormGroup extends React.Component<IFormGroupProps> {
  public render() {
    const { error, helperText: propsHelperText, optional, ...restProps } = this.props;

    let helperText = propsHelperText || '';
    if (error) {
      helperText = error;
    }

    let requiredLabel: React.ReactNode | undefined;
    if (optional) {
      requiredLabel = (
        <small className={Classes.TEXT_MUTED} style={{ paddingLeft: 7 }}>
          nepovinné
        </small>
      );
    }

    return (
      <BlueprintFormGroup
        intent={error ? Intent.DANGER : Intent.NONE}
        helperText={helperText}
        labelInfo={requiredLabel}
        {...restProps}
      />
    );
  }
}

interface IFormGroupFieldProps extends IFormGroupProps {
  name: string;
}

const FormGroupField = (props: IFormGroupFieldProps) => {
  const { name, ...restProps } = props;

  return (
    <Field
      name={name}
      render={({ form }) => (
        <FormGroup
          labelFor={name}
          error={getIn(form.touched, name) && getIn(form.errors, name)}
          {...restProps}
        />
      )}
    />
  );
};

export default FormGroupField;
