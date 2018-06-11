import * as React from 'react';

interface ICheckboxInputProps {
  id: string;
  label: string;
  className?: string;
  defaultChecked?: boolean;
  onChange(evt: React.ChangeEvent<HTMLInputElement>): void;
}

export function CheckboxInput(props: ICheckboxInputProps) {
  return (
    <div className={`form-group ${props.className ? props.className : ''}`}>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          onChange={props.onChange}
          defaultChecked={props.defaultChecked}
          id={props.id}
        />
        <label className="form-check-label" htmlFor={props.id}>
          {props.label}
        </label>
      </div>
    </div>
  );
}
