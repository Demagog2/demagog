import * as React from 'react';

interface IDateInputProps {
  label: string;
  name: string;
  placeholder: string;
  defaultValue: string;
  required?: boolean;
  onChange(evt: React.ChangeEvent<HTMLInputElement>): void;
}

export default function DateInput(props: IDateInputProps) {
  const { label, name, required, placeholder, onChange, defaultValue } = props;

  return (
    <React.Fragment>
      <label htmlFor={name}>{label}:</label>
      <input
        type="date"
        required={required}
        className="form-control"
        id={name}
        placeholder={placeholder}
        onChange={onChange}
        defaultValue={defaultValue}
      />
    </React.Fragment>
  );
}
