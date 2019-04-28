/* eslint camelcase: 0, react/sort-comp: 0 */

import * as React from 'react';

import { Button, Classes, Intent } from '@blueprintjs/core';
import { Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

import { GetMediumQuery, MediumInput } from '../../operation-result-types';
import TextField from './controls/TextField';
import FormGroup from './FormGroup';

interface ISpeakerFormProps {
  medium?: GetMediumQuery['medium'];
  onSubmit: (formData: MediumInput) => Promise<any>;
  title: string;
}

export class MediumForm extends React.Component<ISpeakerFormProps> {
  public render() {
    const { medium, title } = this.props;

    const initialValues = {
      name: medium ? medium.name : '',
    };

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={yup.object().shape({
          name: yup.string().required('Je třeba vyplnit název pořadu'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          const formData: MediumInput = values;

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
              <Link to="/admin/media" className={Classes.BUTTON}>
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

            <h2 className={Classes.HEADING}>{title}</h2>

            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ flex: '0 0 200px' }}>
                <h4 className={Classes.HEADING}>Základní údaje</h4>
              </div>
              <div style={{ flex: '1 1' }}>
                <div style={{ display: 'flex' }}>
                  <div style={{ flex: '1 1' }}>
                    <FormGroup label="Název" name="name">
                      <TextField name="name" />
                    </FormGroup>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}
