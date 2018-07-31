/* eslint camelcase: 0, react/sort-comp: 0 */

import * as React from 'react';

import { Button, Classes, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { FieldArray, Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

import { GetMediumQuery, MediumInputType } from '../../operation-result-types';
import MediaPersonalitiesSelect from './controls/MediaPersonalitySelect';
import SelectComponentField from './controls/SelectComponentField';
import TextField from './controls/TextField';
import FormGroup from './FormGroup';

interface ISpeakerFormProps {
  medium?: GetMediumQuery['medium'];
  onSubmit: (formData: MediumInputType) => Promise<any>;
  title: string;
}

export class MediumForm extends React.Component<ISpeakerFormProps> {
  public render() {
    const { medium, title } = this.props;

    const initialValues = {
      name: medium ? medium.name : '',
      media_personalities: medium
        ? medium.personalities.map((p) => ({
            media_personality_id: p.id,
          }))
        : [],
    };

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={yup.object().shape({
          name: yup.string().required('Je třeba vyplnit název pořadu'),
          media_personalities: yup.array().of(
            yup.object().shape({
              media_personality_id: yup.mixed().notOneOf([null], 'Je třeba vybrat moderátora'),
            }),
          ),
        })}
        onSubmit={(values, { setSubmitting }) => {
          const formData: MediumInputType = values;

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

            <h2>{title}</h2>

            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ flex: '0 0 200px' }}>
                <h4>Základní údaje</h4>
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
            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ flex: '0 0 200px' }}>
                <h4>Moderátoři</h4>
              </div>
              <div style={{ flex: '1 1' }}>
                <FieldArray
                  name="media_personalities"
                  render={(arrayHelpers) => (
                    <div>
                      {values.media_personalities.map((_0, index) => (
                        <div key={index} style={{ display: 'flex' }}>
                          <div style={{ flex: '1 1 300px' }}>
                            <FormGroup
                              label="Moderátor"
                              name={`media_personalities.${index}.media_personality_id`}
                            >
                              <SelectComponentField
                                name={`media_personalities.${index}.media_personality_id`}
                              >
                                {(renderProps) => (
                                  <MediaPersonalitiesSelect mediumOptional {...renderProps} />
                                )}
                              </SelectComponentField>
                            </FormGroup>
                          </div>
                          <div style={{ flex: '0 0 30px', marginLeft: 15, paddingTop: 15 }}>
                            <Button
                              icon={IconNames.TRASH}
                              onClick={() => arrayHelpers.remove(index)}
                              minimal
                              title="Odstranit moderátora"
                            />
                          </div>
                        </div>
                      ))}
                      <Button
                        onClick={() => arrayHelpers.push({ media_personality_id: null })}
                        icon={IconNames.PLUS}
                        text="Přidat moderátora"
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}
