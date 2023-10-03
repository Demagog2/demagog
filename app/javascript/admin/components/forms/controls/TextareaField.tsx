import * as React from 'react';

import { Classes } from '@blueprintjs/core';
import * as classNames from 'classnames';
import type { FieldProps } from 'formik';
import { Field, getIn } from 'formik';

interface ITextareaInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: object | false;
}

const TextareaInput = (props: ITextareaInputProps) => {
  const { error, ...restProps } = props;

  return (
    <textarea
      className={classNames(Classes.INPUT, Classes.FILL, {
        [Classes.INTENT_DANGER]: !!error,
      })}
      dir="auto"
      {...restProps}
    />
  );
};

interface ITextareaFieldProps extends ITextareaInputProps {
  name: string;
}

const TextareaField = (props: ITextareaFieldProps) => {
  const { name, ...restProps } = props;

  return (
    <Field
      name={name}
      render={({ field, form }: FieldProps) => (
        <TextareaInput
          id={name}
          error={getIn(form.touched, name) && getIn(form.errors, name)}
          {...field}
          {...restProps}
        />
      )}
    />
  );
};

export default TextareaField;
