/* eslint camelcase: 0, react/sort-comp: 0 */

import * as React from 'react';

import { Classes, FormGroup, Switch } from '@blueprintjs/core';
import * as classNames from 'classnames';
import { Link } from 'react-router-dom';

import { GetUserQuery, UserInputType } from '../../operation-result-types';
import SpeakerAvatar from '../SpeakerAvatar';
import ImageInput, { ImageValueType } from './controls/ImageInput';
import RoleSelect from './controls/RoleSelect';
import { Form } from './Form';

export interface IUserFormData extends UserInputType {
  avatar: ImageValueType;
}

interface IUserFormProps {
  userQuery?: GetUserQuery;
  onSubmit: (formData: IUserFormData) => void;
  submitting: boolean;
  title: string;
}

class UserFormInternal extends Form<IUserFormData> {}

// tslint:disable-next-line:max-classes-per-file
export class UserForm extends React.Component<IUserFormProps> {
  public static defaultProps = {
    userQuery: {
      user: {
        id: '',

        active: true,
        email: '',
        first_name: '',
        last_name: '',
        avatar: null,
        bio: '',
        role: {
          id: null,
        },
      },
    },
  };

  // tslint:disable-next-line:member-ordering
  public render() {
    const { userQuery, submitting, title } = this.props;

    if (!userQuery) {
      return null;
    }

    const defaultValues = {
      active: userQuery.user.active,
      email: userQuery.user.email,
      first_name: userQuery.user.first_name,
      last_name: userQuery.user.last_name,
      avatar: userQuery.user.avatar,
      bio: userQuery.user.bio,
      role_id: userQuery.user.role.id,
    };

    return (
      <UserFormInternal defaultValues={defaultValues} onSubmit={this.props.onSubmit}>
        {({ onAssociationChange, onInputChange, onCheckboxChange, onImageChange }, data) => (
          <div>
            <div style={{ float: 'right' }}>
              <Link to="/admin/users" className={Classes.BUTTON}>
                Zpět
              </Link>
              <button
                type="submit"
                className={classNames(Classes.BUTTON, Classes.INTENT_PRIMARY)}
                style={{ marginLeft: 7 }}
                disabled={submitting}
              >
                {submitting ? 'Ukládám ...' : 'Uložit'}
              </button>
            </div>

            <h2>{title}</h2>

            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ flex: '0 0 200px' }}>
                <h4>Základní údaje</h4>
              </div>
              <div style={{ flex: '1 1' }}>
                <FormGroup label="Jméno" labelFor="first-name">
                  <input
                    id="first-name"
                    className={classNames(Classes.INPUT, Classes.FILL)}
                    type="text"
                    dir="auto"
                    defaultValue={userQuery.user.first_name || ''}
                    onChange={onInputChange('first_name')}
                  />
                </FormGroup>
              </div>
              <div style={{ flex: '1 1', marginLeft: 15 }}>
                <FormGroup label="Přijmení" labelFor="last-name">
                  <input
                    id="last-name"
                    className={classNames(Classes.INPUT, Classes.FILL)}
                    type="text"
                    dir="auto"
                    defaultValue={userQuery.user.last_name || ''}
                    onChange={onInputChange('last_name')}
                  />
                </FormGroup>
              </div>
            </div>

            <div style={{ display: 'flex', marginTop: 15 }}>
              <div style={{ flex: '0 0 200px' }}>
                <h4>Přístup do administrace</h4>
              </div>
              <div style={{ flex: '1 1' }}>
                <FormGroup
                  label="E-mail"
                  labelFor="email"
                  helperText="Uživatel musí mít Google účet s tímto emailem, aby se dokázal do administrace přihlásit"
                >
                  <input
                    id="email"
                    className={classNames(Classes.INPUT, Classes.FILL)}
                    type="text"
                    dir="auto"
                    defaultValue={userQuery.user.email || ''}
                    onChange={onInputChange('email')}
                  />
                </FormGroup>
                <div style={{ marginTop: 15, marginBottom: 15 }}>
                  <Switch
                    checked={data.active}
                    label="Aktivovaný uživatel"
                    onChange={onCheckboxChange('active')}
                  />
                </div>
                <FormGroup label="Přístupová práva" labelFor="role">
                  <RoleSelect
                    id="role"
                    value={data.role_id || null}
                    onChange={onAssociationChange('role_id')}
                  />
                </FormGroup>
              </div>
            </div>

            <div style={{ display: 'flex', marginTop: 15 }}>
              <div style={{ flex: '0 0 200px' }}>
                <h4>Veřejný profil</h4>
              </div>
              <div style={{ flex: '1 1' }}>
                <FormGroup label="Portrét">
                  <ImageInput
                    defaultValue={userQuery.user.avatar}
                    onChange={onImageChange('avatar')}
                    renderImage={(src) => <SpeakerAvatar avatar={src} />}
                  />
                </FormGroup>
                <FormGroup label="Popis pozice" labelFor="position-description">
                  <input
                    id="position-description"
                    className={classNames(Classes.INPUT, Classes.FILL)}
                    type="text"
                    dir="auto"
                    defaultValue={userQuery.user.position_description || ''}
                    onChange={onInputChange('position_description')}
                  />
                </FormGroup>
                <FormGroup label="Bio" labelFor="bio">
                  <textarea
                    id="bio"
                    className={classNames(Classes.INPUT, Classes.FILL)}
                    dir="auto"
                    defaultValue={userQuery.user.bio || ''}
                    onChange={onInputChange('bio')}
                    rows={9}
                  />
                </FormGroup>
              </div>
            </div>
          </div>
        )}
      </UserFormInternal>
    );
  }
}
