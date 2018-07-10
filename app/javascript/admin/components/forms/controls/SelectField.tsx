import * as React from 'react';

import { Classes, Colors } from '@blueprintjs/core';
import { Field, FieldProps, getIn } from 'formik';

interface ISelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: object | false;
  options: Array<{ label: string; value: any }>;
}

class SelectInput extends React.Component<ISelectInputProps> {
  public render() {
    const { error, options, style, ...restProps } = this.props;

    const selectStyle = Object.assign(
      error
        ? {
            boxShadow: `inset 0 0 3px ${Colors.RED3}`,
          }
        : {},
      style || {},
    );

    return (
      <div className={Classes.SELECT}>
        <select style={selectStyle} {...restProps}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

interface ISelectFieldProps extends ISelectInputProps {
  name: string;
}

const SelectField = (props: ISelectFieldProps) => {
  const { name, ...restProps } = props;

  return (
    <Field
      name={name}
      render={({ field, form }: FieldProps) => (
        <SelectInput
          id={name}
          name={name}
          error={getIn(form.touched, name) && getIn(form.errors, name)}
          {...field}
          {...restProps}
        />
      )}
    />
  );
};

export default SelectField;
