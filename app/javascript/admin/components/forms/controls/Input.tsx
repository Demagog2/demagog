import * as React from 'react';

interface IStylable {
  className?: string;
}

interface IInputProps extends IStylable {
  id: string;
  placeholder: string;
  defaultValue: string | null;
  label: string;

  required?: boolean;

  onChange(evt: any): void;
}

export function Input(props: IInputProps) {
  return (
    <div className={`form-group ${props.className ? props.className : ''}`}>
      <label className="form-control-label" htmlFor={props.id}>
        {props.label}
      </label>
      <input
        className="form-control"
        id={props.id}
        required={props.required}
        placeholder={props.placeholder}
        onChange={props.onChange}
        defaultValue={props.defaultValue || ''}
      />
      <div className="invalid-feedback">Prosím vyplňte pole</div>
    </div>
  );
}
