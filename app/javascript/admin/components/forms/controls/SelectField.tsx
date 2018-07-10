import * as React from 'react';

// import { Colors } from '@blueprintjs/core';
import { Field, FieldProps, getIn } from 'formik';
// import Select, { ReactSelectProps } from 'react-select';

// export interface ISelectInputProps extends ReactSelectProps {
//   error?: object | false;
// }

// class SelectInput extends React.Component<ISelectInputProps> {
//   public render() {
//     return (
//       <Select
//         style={{
//           borderColor: this.props.error ? Colors.RED3 : Colors.LIGHT_GRAY1,
//         }}
//       />
//     );
//   }
// }

interface ISelectFieldRenderProps {
  error: object | false;
  id: string;
  name: string;
  onChange: (value: any) => void;
  onBlur: () => void;
  value: any;
}

interface ISelectFieldProps {
  name: string;
  children: (selectInputProps: ISelectFieldRenderProps) => React.ReactNode;
}

const SelectField = (props: ISelectFieldProps) => {
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

export default SelectField;
