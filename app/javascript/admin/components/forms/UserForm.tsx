/* eslint camelcase: 0, react/sort-comp: 0 */

import * as React from 'react';
import { Link } from 'react-router-dom';

import { GetUserQuery, UserInputType } from '../../operation-result-types';
import SpeakerAvatar from '../SpeakerAvatar';
import ImageInput, { ImageValueType } from './controls/ImageInput';

export interface IUserFormData extends UserInputType {
  avatar: ImageValueType;
}

interface IUserFormProps {
  userQuery?: GetUserQuery;
  onSubmit: (formData: IUserFormData) => void;
  submitting: boolean;
}

interface IUserFields {
  email: string;
  active: boolean | null;
  first_name: string | null;
  last_name: string | null;
  avatar: ImageValueType;
}

interface IUserFormState extends IUserFields {
  isFormValidated: boolean;
}

// tslint:disable-next-line:max-classes-per-file
export class UserForm extends React.Component<IUserFormProps, IUserFormState> {
  public static defaultProps = {
    userQuery: {
      user: {
        id: '',

        email: '',
        first_name: '',
        last_name: '',
        avatar: null,
      },
    },
  };

  constructor(props: IUserFormProps) {
    super(props);

    if (props.userQuery) {
      this.state = {
        isFormValidated: false,

        email: props.userQuery.user.email,
        active: props.userQuery.user.active,
        first_name: props.userQuery.user.first_name,
        last_name: props.userQuery.user.last_name,
        avatar: props.userQuery.user.avatar,
      };
    }
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

  private onChange = (name: keyof IUserFields) => (evt: React.ChangeEvent<HTMLInputElement>) => {
    const state: { [P in keyof Extract<IUserFields, string>]: string } = {
      [name]: evt.target.value,
    };

    this.setState(state);
  };

  private onImageChange = (name: keyof IUserFields) => (value: ImageValueType) => {
    const state: { [P in keyof Extract<IUserFields, string>]: string } = {
      [name]: value,
    };

    this.setState(state);
  };

  private getFormValues(): IUserFormData {
    const { active, email, first_name, last_name, avatar } = this.state;

    return {
      email,
      active: active || false,
      first_name: first_name || '',
      last_name: last_name || '',
      avatar: avatar || null,
    };
  }

  // tslint:disable-next-line:member-ordering
  public render() {
    const { userQuery, submitting } = this.props;
    const { avatar } = this.state;

    if (!userQuery || avatar === undefined) {
      return null;
    }

    return (
      <form
        className={this.state.isFormValidated ? 'was-validated' : ''}
        noValidate
        onSubmit={this.onSubmit}
      >
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="first_name">Jméno:</label>
            <input
              required
              className="form-control"
              id="first_name"
              placeholder="Zadejte jméno"
              defaultValue={userQuery.user.first_name || ''}
              onChange={this.onChange('first_name')}
            />
          </div>

          <div className="form-group col-md-6">
            <label htmlFor="last_name">Přijmení</label>
            <input
              required
              className="form-control"
              id="last_name"
              placeholder="Zadejte přijmení"
              defaultValue={userQuery.user.last_name || ''}
              onChange={this.onChange('last_name')}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group col-md-12">
            <ImageInput
              label="Portrét"
              name="avatar"
              value={avatar}
              onChange={this.onImageChange('avatar')}
              renderImage={(src) => <SpeakerAvatar avatar={src} />}
            />
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Ukládám ...' : 'Uložit'}
          </button>
          <Link to="/admin/users" className="btn">
            Zpět na seznam
          </Link>
        </div>
      </form>
    );
  }
}
