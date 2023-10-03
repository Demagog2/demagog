/* eslint camelcase: 0, react/sort-comp: 0 */

import * as React from 'react';

import { Button, Classes, Intent } from '@blueprintjs/core';
import { Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

import type {
  GetMediaPersonality as GetMediaPersonalityQuery,
  MediaPersonalityInput,
} from '../../operation-result-types';
import TextField from './controls/TextField';
import FormGroup from './FormGroup';

interface IMediaPersonalityFormProps {
  mediaPersonality?: GetMediaPersonalityQuery['mediaPersonality'];
  onSubmit: (formData: MediaPersonalityInput) => Promise<any>;
  title: string;
}

export class MediaPersonalityForm extends React.Component<IMediaPersonalityFormProps> {
  public render() {
    const { mediaPersonality, title } = this.props;

    const initialValues = {
      name: mediaPersonality ? mediaPersonality.name : '',
    };

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={yup.object().shape({
          name: yup.string().required('Je třeba vyplnit jméno a příjmení moderátora'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          const formData: MediaPersonalityInput = values;

          this.props
            .onSubmit(formData)
            .then(() => { setSubmitting(false); })
            .catch(() => { setSubmitting(false); });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div style={{ float: 'right' }}>
              <Link to="/admin/media-personalities" className={Classes.BUTTON}>
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
                    <FormGroup label="Jméno a příjmení" name="name">
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
