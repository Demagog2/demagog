import * as React from 'react';

import { Field, FieldProps, getIn } from 'formik';

interface ISelectComponentFieldRenderProps {
  error: object | false;
  id: string;
  name: string;
  onChange: (value: any) => void;
  onBlur: () => void;
  value: any;
}

interface ISelectComponentFieldProps {
  name: string;
  children: (selectInputProps: ISelectComponentFieldRenderProps) => React.ReactNode;
}

const SelectComponentField = (props: ISelectComponentFieldProps) => {
  const { children, name } = props;

  return (
    <Field
      name={name}
      render={({ field, form }: FieldProps) =>
        children({
          error: getIn(form.touched, name) && getIn(form.errors, name),
          id: name,
          name,
          onChange: (value) => form.setFieldValue(name, value),
          onBlur: () => form.setFieldTouched(name),
          value: field.value,
        })
      }
    />
  );
};

export default SelectComponentField;
