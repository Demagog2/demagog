import * as React from 'react';

import { Classes } from '@blueprintjs/core';
import * as classNames from 'classnames';
import type { FieldProps } from 'formik';
import { Field, getIn } from 'formik';

interface ITextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: object | false;
}

class TextInput extends React.Component<ITextInputProps> {
  public render() {
    const { error, ...restProps } = this.props;

    return (
      <input
        type="text"
        dir="auto"
        className={classNames(Classes.INPUT, Classes.FILL, {
          [Classes.INTENT_DANGER]: !!error,
        })}
        {...restProps}
      />
    );
  }
}

interface ITextFieldProps extends ITextInputProps {
  name: string;
}

const TextField = (props: ITextFieldProps) => {
  const { name, ...restProps } = props;

  return (
    <Field
      name={name}
      render={({ field, form }: FieldProps) => (
        <TextInput
          id={name}
          error={getIn(form.touched, name) && getIn(form.errors, name)}
          {...field}
          {...restProps}
        />
      )}
    />
  );
};

export default TextField;
