/* eslint camelcase: 0, react/sort-comp: 0 */

import * as React from 'react';

import { Button, Classes, Intent } from '@blueprintjs/core';
import { Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

import { GetUserQuery, UserInputType } from '../../operation-result-types';
import SpeakerAvatar from '../SpeakerAvatar';
import ImageField, { ImageValueType } from './controls/ImageField';
import RoleSelect from './controls/RoleSelect';
import SelectComponentField from './controls/SelectComponentField';
import SwitchField from './controls/SwitchField';
import TextareaField from './controls/TextareaField';
import TextField from './controls/TextField';
import FormGroup from './FormGroup';

export interface IUserFormData extends UserInputType {
  avatar: ImageValueType;
}

interface IUserFormProps {
  user?: GetUserQuery['user'];
  onSubmit: (formData: IUserFormData) => Promise<any>;
  title: string;
}

export class UserForm extends React.Component<IUserFormProps> {
  public render() {
    const { title, user } = this.props;

    const initialValues = user
      ? { ...user, role_id: user.role.id }
      : {
          active: true,
          email: '',
          first_name: '',
          last_name: '',
          avatar: null,
          bio: '',
          role_id: null,
          position_description: '',
        };

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={yup.object().shape({
          first_name: yup.string().required('Je třeba vyplnit jméno'),
          last_name: yup.string().required('Je třeba vyplnit příjmení'),
          email: yup
            .string()
            .required('Je třeba vyplnit email')
            .email('Tohle nevypadá na opravdový email, že by překlep?'),
          role_id: yup.mixed().notOneOf([null], 'Je třeba vybrat přístupová práva'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          const formData: IUserFormData = {
            email: values.email,
            active: values.active,
            first_name: values.first_name,
            last_name: values.last_name,
            position_description: values.position_description,
            bio: values.bio,
            avatar: values.avatar,

            // role_id will always be a string, because null won't pass validation
            role_id: values.role_id as string,
          };

          this.props
            .onSubmit(formData)
            .then(() => {
              setSubmitting(false);
            })
            .catch(() => {
              setSubmitting(false);
            });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div style={{ float: 'right' }}>
              <Link to="/admin/users" className={Classes.BUTTON}>
                Zpět
              </Link>
              <Button
                type="submit"
                intent={Intent.PRIMARY}
                style={{ marginLeft: 7 }}
                disabled={isSubmitting}
                text={isSubmitting ? 'Ukládám…' : 'Uložit'}
              />
            </div>

            <h2>{title}</h2>

            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ flex: '0 0 200px' }}>
                <h4>Základní údaje</h4>
              </div>
              <div style={{ flex: '1 1' }}>
                <FormGroup label="Jméno" name="first_name">
                  <TextField name="first_name" />
                </FormGroup>
              </div>
              <div style={{ flex: '1 1', marginLeft: 15 }}>
                <FormGroup label="Přijmení" name="last_name">
                  <TextField name="last_name" />
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
                  name="email"
                  helperText="Uživatel musí mít Google účet s tímto emailem, aby se dokázal do administrace přihlásit"
                >
                  <TextField name="email" />
                </FormGroup>
                <div style={{ marginTop: 15, marginBottom: 15 }}>
                  <SwitchField name="active" label="Aktivovaný uživatel" />
                </div>
                <FormGroup label="Přístupová práva" name="role_id">
                  <SelectComponentField name="role_id">
                    {(renderProps) => <RoleSelect {...renderProps} />}
                  </SelectComponentField>
                </FormGroup>
              </div>
            </div>

            <div style={{ display: 'flex', marginTop: 15 }}>
              <div style={{ flex: '0 0 200px' }}>
                <h4>Veřejný profil</h4>
              </div>
              <div style={{ flex: '1 1' }}>
                <FormGroup label="Portrét" name="avatar" optional>
                  <ImageField name="avatar" renderImage={(src) => <SpeakerAvatar avatar={src} />} />
                </FormGroup>
                <FormGroup label="Popis pozice" name="position_description" optional>
                  <TextField name="position_description" />
                </FormGroup>
                <FormGroup label="Bio" name="bio" optional>
                  <TextareaField name="bio" rows={9} />
                </FormGroup>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}
