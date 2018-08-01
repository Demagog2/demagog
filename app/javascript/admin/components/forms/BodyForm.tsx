/* eslint camelcase: 0 */

import * as React from 'react';

import { Button, Classes, Intent } from '@blueprintjs/core';
import { Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

import { BodyInputType, GetBodyQuery } from '../../operation-result-types';
import BodyLogo from '../BodyLogo';
import DateField from './controls/DateField';
import ImageField, { ImageValueType } from './controls/ImageField';
import SwitchField from './controls/SwitchField';
import TextField from './controls/TextField';
import FormGroup from './FormGroup';

export interface IBodyFormData extends BodyInputType {
  logo: ImageValueType;
}

interface IBodyProps {
  body?: GetBodyQuery['body'];
  onSubmit: (formData: IBodyFormData) => Promise<any>;
  title: string;
}

export class BodyForm extends React.Component<IBodyProps> {
  public render() {
    const { body, title } = this.props;

    const initialValues = body
      ? body
      : {
          name: '',
          short_name: '',
          link: '',
          logo: null,
          is_party: true,
          founded_at: null,
          is_inactive: false,
          terminated_at: null,
        };

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={yup.object().shape({
          name: yup.string().required('Je třeba vyplnit název'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          const formData: IBodyFormData = {
            name: values.name,
            short_name: values.short_name,
            link: values.link,
            logo: values.logo,
            is_party: values.is_party,
            founded_at: values.founded_at,
            is_inactive: values.is_inactive,
            terminated_at: values.terminated_at,
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
        {({ values, isSubmitting }) => (
          <Form>
            <div style={{ float: 'right' }}>
              <Link to="/admin/bodies" className={Classes.BUTTON}>
                Zpět
              </Link>
              <Button
                type="submit"
                intent={Intent.PRIMARY}
                style={{ marginLeft: 7 }}
                disabled={isSubmitting}
                text={isSubmitting ? 'Ukládám ...' : 'Uložit'}
              />
            </div>

            <h2 className={Classes.HEADING}>{title}</h2>

            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ flex: '0 0 200px', marginRight: 15 }}>
                <h4 className={Classes.HEADING}>Základní údaje</h4>
              </div>
              <div style={{ flex: '1 1' }}>
                <FormGroup label="Název" name="name">
                  <TextField name="name" />
                </FormGroup>
                <FormGroup label="Zkrácený název" name="short-name" optional>
                  <TextField name="short_name" className={Classes.INPUT} />
                </FormGroup>
                <SwitchField
                  name="is_party"
                  label="Jde o politickou stranu"
                  style={{ marginBottom: 20 }}
                />
                <FormGroup
                  label="Respekovaný odkaz obsahující popis (wikipedia, nasipolitici, atp.)"
                  name="link"
                  optional
                >
                  <TextField name="link" />
                </FormGroup>
                <FormGroup label="Logo" name="logo" optional>
                  <ImageField name="logo" renderImage={(src) => <BodyLogo logo={src} />} />
                </FormGroup>
              </div>
            </div>

            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ flex: '0 0 200px', marginRight: 15 }}>
                <h4 className={Classes.HEADING}>Vznik a zánik</h4>
              </div>
              <div style={{ flex: '1 1' }}>
                <FormGroup label="Datum vzniku" name="founded_at" optional>
                  <DateField name="founded_at" />
                </FormGroup>
                <SwitchField
                  name="is_inactive"
                  label="Skupina zanikla / není aktivní"
                  style={{ marginBottom: 20 }}
                />
                <FormGroup label="Datum zániku" name="terminated_at" optional>
                  <DateField disabled={!values.is_inactive} name="terminated_at" />
                </FormGroup>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}
