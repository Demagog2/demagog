import * as React from 'react';

import { omit } from 'lodash';

import { ImageValueType } from './controls/ImageInput';

interface ICallbacks {
  onInputChange: any;
  onImageChange: any;
  onCheckboxChange: any;
  onAssociationChange: any;
}

interface IFormProps<T> {
  defaultValues: T;

  children(callbacks: ICallbacks, data: T): JSX.Element;
  onSubmit(data: T): void;
}

interface IFormState<T> {
  isFormValidated: boolean;

  data: T;
}

// tslint:disable-next-line:max-classes-per-file
export class Form<T extends {}> extends React.Component<IFormProps<T>, IFormState<T>> {
  constructor(props: IFormProps<T>) {
    super(props);

    this.state = {
      isFormValidated: false,
      data: props.defaultValues,
    };
  }

  // TODO: Replace any with specific event type
  private onSubmit = (evt: any) => {
    evt.preventDefault();

    const isValid = evt.target.checkValidity();

    if (isValid) {
      this.props.onSubmit(this.getFormValues());
    }

    this.setState({ isFormValidated: true });
  };

  private dataUpdate = (update: { [name: string]: string | ImageValueType | boolean | any[] }) => {
    this.setState({ data: Object.assign({}, this.state.data, update) });
  };

  private onInputChange = (name: keyof T) => (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.dataUpdate({ [name]: evt.target.value });
  };

  private onImageChange = (name: keyof T) => (value: ImageValueType) => {
    this.dataUpdate({ [name]: value });
  };

  private onCheckboxChange = (name: keyof T) => (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.dataUpdate({ [name]: evt.target.checked });
  };

  private onAssociationChange = (name: keyof T) => (value: any[]) => {
    this.dataUpdate({ [name]: value });
  };

  private getFormValues(): T {
    return omit(this.state.data, ['id', '__typename']);
  }

  // tslint:disable-next-line:member-ordering
  public render() {
    const { onAssociationChange, onCheckboxChange, onImageChange, onInputChange } = this;

    return (
      <form
        className={this.state.isFormValidated ? 'was-validated' : ''}
        noValidate
        onSubmit={this.onSubmit}
      >
        {this.props.children(
          {
            onAssociationChange,
            onCheckboxChange,
            onImageChange,
            onInputChange,
          },
          this.state.data,
        )}
      </form>
    );
  }
}
