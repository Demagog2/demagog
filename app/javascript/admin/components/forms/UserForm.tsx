/* eslint camelcase: 0, react/sort-comp: 0 */

import * as React from 'react';
import { Link } from 'react-router-dom';

import { GetUserQuery, UserInputType } from '../../operation-result-types';
import SpeakerAvatar from '../SpeakerAvatar';
import ImageInput, { ImageValueType } from './controls/ImageInput';
import { Form } from './Form';

export interface IUserFormData extends UserInputType {
  avatar: ImageValueType;
}

interface IUserFormProps {
  userQuery?: GetUserQuery;
  onSubmit: (formData: IUserFormData) => void;
  submitting: boolean;
}

class UserFormInternal extends Form<IUserFormData> {}

// tslint:disable-next-line:max-classes-per-file
export class UserForm extends React.Component<IUserFormProps> {
  public static defaultProps = {
    userQuery: {
      user: {
        id: '',

        active: false,
        email: '',
        first_name: '',
        last_name: '',
        avatar: null,
        bio: '',
      },
    },
  };

  // tslint:disable-next-line:member-ordering
  public render() {
    const { userQuery, submitting } = this.props;

    if (!userQuery) {
      return null;
    }

    return (
      <UserFormInternal defaultValues={userQuery.user} onSubmit={this.props.onSubmit}>
        {({ onInputChange, onCheckboxChange, onImageChange }) => (
          <React.Fragment>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="first_name">Jméno:</label>
                <input
                  className="form-control"
                  id="first_name"
                  placeholder="Zadejte jméno"
                  defaultValue={userQuery.user.first_name || ''}
                  onChange={onInputChange('first_name')}
                />
              </div>

              <div className="form-group col-md-6">
                <label htmlFor="last_name">Přijmení</label>
                <input
                  className="form-control"
                  id="last_name"
                  placeholder="Zadejte přijmení"
                  defaultValue={userQuery.user.last_name || ''}
                  onChange={onInputChange('last_name')}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="email">E-mail:</label>
                <input
                  required
                  className="form-control"
                  id="email"
                  placeholder="Zadejte jméno"
                  defaultValue={userQuery.user.email || ''}
                  onChange={onInputChange('email')}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-3">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    onChange={onCheckboxChange('active')}
                    defaultChecked={userQuery.user.active}
                    id="active"
                  />
                  <label className="form-check-label" htmlFor="active">
                    Uživatel je aktivní:
                  </label>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-12">
                <ImageInput
                  label="Portrét"
                  name="avatar"
                  defaultValue={userQuery.user.avatar}
                  onChange={onImageChange('avatar')}
                  renderImage={(src) => <SpeakerAvatar avatar={src} />}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio:</label>
              <textarea
                className="form-control"
                id="bio"
                rows={3}
                onChange={onInputChange('bio')}
                defaultValue={userQuery.user.bio || ''}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Popis pozice:</label>
              <textarea
                className="form-control"
                id="position_description"
                rows={3}
                onChange={onInputChange('position_description')}
                defaultValue={userQuery.user.position_description || ''}
              />
            </div>

            <div style={{ marginTop: 20 }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Ukládám ...' : 'Uložit'}
              </button>
              <Link to="/admin/users" className="btn">
                Zpět na seznam
              </Link>
            </div>
          </React.Fragment>
        )}
      </UserFormInternal>
    );
  }
}
