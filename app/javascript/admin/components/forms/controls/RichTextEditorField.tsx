import * as React from 'react';

import { Field, FieldProps } from 'formik';

import RichTextEditor from '../../RichTextEditor';

const RichTextEditorInput = (props: any) => {
  const { onChange, value, ...restProps } = props;

  return <RichTextEditor html={value} onChange={onChange} {...restProps} />;
};

interface IRichTextEditorField {
  name: string;
}

const RichTextEditorField = (props: IRichTextEditorField) => {
  const { name, ...restProps } = props;

  return (
    <Field
      name={name}
      render={({ field, form }: FieldProps) => (
        <RichTextEditorInput
          value={field.value}
          onChange={(value) => form.setFieldValue(name, value)}
          {...restProps}
        />
      )}
    />
  );
};

export default RichTextEditorField;
