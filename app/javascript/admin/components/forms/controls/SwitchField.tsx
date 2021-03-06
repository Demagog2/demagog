import * as React from 'react';

import { Colors, ISwitchProps, Switch } from '@blueprintjs/core';
import { Field, FieldProps, getIn } from 'formik';

interface ISwitchFieldProps extends ISwitchProps {
  label: string;
  name: string;
}

const SwitchField = (props: ISwitchFieldProps) => {
  const { label, name, ...restProps } = props;

  return (
    <Field
      name={name}
      render={({ field, form }: FieldProps) => {
        const error = getIn(form.touched, name) && getIn(form.errors, name);

        return (
          <>
            <Switch
              id={name}
              name={name}
              label={label}
              checked={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              {...restProps}
            />

            {error && <small style={{ color: Colors.RED3 }}>{error}</small>}
          </>
        );
      }}
    />
  );
};

export default SwitchField;
