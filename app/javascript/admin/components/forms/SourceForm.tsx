/* eslint camelcase: 0 */

import * as React from 'react';

import { Button, Classes, Intent } from '@blueprintjs/core';
import { Form, Formik } from 'formik';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

import { GetSource as GetSourceQuery, SourceInput } from '../../operation-result-types';
import { IState as ReduxState } from '../../reducers';
import DateField from './controls/DateField';
import MediaPersonalitiesSelect from './controls/MediaPersonalitySelect';
import MediumSelect from './controls/MediumSelect';
import SelectComponentField from './controls/SelectComponentField';
import SpeakersSelect from './controls/SpeakersSelect';
import TextareaField from './controls/TextareaField';
import TextField from './controls/TextField';
import UserSelect from './controls/UserSelect';
import FormGroup from './FormGroup';

interface ISourceFormProps {
  backPath: string;
  source?: GetSourceQuery['source'];
  onSubmit: (formData: SourceInput) => Promise<any>;
  title: string;

  currentUser: ReduxState['currentUser']['user'];
}

class SourceForm extends React.Component<ISourceFormProps> {
  public render() {
    const { backPath, currentUser, source, title } = this.props;

    const initialValues = {
      name: source?.name ?? '',
      medium_id: source?.medium?.id,
      media_personalities: source?.mediaPersonalities?.map((p) => p.id) ?? [],
      released_at: source?.releasedAt ?? DateTime.local().toISODate(),
      source_url: source?.sourceUrl ?? '',
      speakers: source?.speakers?.map((s) => s.id) ?? [],
      transcript: source?.transcript ?? '',
      experts: source?.experts?.map((u) => u.id) ?? [],
    };

    // When creating new source, prefill experts with the current user
    if (!source && currentUser) {
      initialValues.experts = [currentUser.id];
    }

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={yup.object().shape({
          name: yup.string().required('Je třeba vyplnit název'),
          medium_id: yup.string().nullable(),
          released_at: yup.string().nullable(),
          speakers: yup.array().nullable(),
        })}
        onSubmit={(values, { setSubmitting }) => {
          const formData: SourceInput = {
            name: values.name,
            sourceUrl: values.source_url,
            speakers: values.speakers,
            transcript: values.transcript,
            mediaPersonalities: values.media_personalities,
            // medium_id will always be a string, because null won't pass validation
            mediumId: values.medium_id as string,
            // released_at will always be a string, because null won't pass validation
            releasedAt: values.released_at as string,
            experts: values.experts,
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
              <Link to={backPath} className={Classes.BUTTON}>
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
                <FormGroup name="name" label="Název">
                  <TextField name="name" />
                </FormGroup>
                <div style={{ display: 'flex' }}>
                  <div style={{ flex: '1 1' }}>
                    <FormGroup name="medium_id" label="Pořad">
                      <>
                        <SelectComponentField name="medium_id">
                          {(renderProps) => <MediumSelect {...renderProps} />}
                        </SelectComponentField>
                        <div className={Classes.FORM_HELPER_TEXT}>
                          Chybí ti v seznamu pořad? Přidej si ho přes agendu{' '}
                          <Link to="/admin/media">Pořady</Link>.
                        </div>
                      </>
                    </FormGroup>
                  </div>
                  <div style={{ flex: '1 1', marginLeft: 15 }}>
                    <FormGroup name="media_personalities" label="Moderátoři">
                      <>
                        <SelectComponentField name="media_personalities">
                          {(renderProps) => <MediaPersonalitiesSelect {...renderProps} />}
                        </SelectComponentField>
                        <div className={Classes.FORM_HELPER_TEXT}>
                          Chybí ti v seznamu moderátoři? Přidej si je přes agendu{' '}
                          <Link to="/admin/media-personalities">Moderátoři</Link>.
                        </div>
                      </>
                    </FormGroup>
                  </div>
                </div>
                <FormGroup name="released_at" label="Publikováno">
                  <DateField name="released_at" />
                </FormGroup>
                <FormGroup name="source_url" label="Odkaz" optional>
                  <TextField name="source_url" placeholder="http://www…" />
                </FormGroup>
              </div>
            </div>

            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ flex: '0 0 200px', marginRight: 15 }}>
                <h4 className={Classes.HEADING}>Řečníci</h4>

                <p>Výroky v rámci této diskuze půjde vytvořit jen pro osoby zde vybrané.</p>
              </div>
              <div style={{ flex: '1 1' }}>
                <FormGroup name="speakers" label="Řečníci">
                  <SelectComponentField name="speakers">
                    {(renderProps) => <SpeakersSelect {...renderProps} />}
                  </SelectComponentField>
                </FormGroup>
              </div>
            </div>

            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ flex: '0 0 200px', marginRight: 15 }}>
                <h4 className={Classes.HEADING}>Editoři</h4>

                <p>Vybraní budou dostávat notifikace při změnách výroků v rámci této diskuze.</p>
              </div>
              <div style={{ flex: '1 1' }}>
                <FormGroup name="experts" label="Editoři" optional>
                  <SelectComponentField name="experts">
                    {(renderProps) => (
                      <UserSelect isMulti roles={['expert', 'admin']} {...renderProps} />
                    )}
                  </SelectComponentField>
                </FormGroup>
              </div>
            </div>

            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ flex: '0 0 200px', marginRight: 15 }}>
                <h4 className={Classes.HEADING}>Přepis</h4>

                <p>
                  Je-li dostupný, doporučujeme vyplnit, protože usnaďňuje vytváření výroků
                  označováním v přepisu.
                </p>
              </div>
              <div style={{ flex: '1 1' }}>
                <FormGroup name="transcript" label="Přepis" optional>
                  <TextareaField name="transcript" rows={15} />
                </FormGroup>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

const mapStateToProps = (state: ReduxState) => ({
  currentUser: state.currentUser.user,
});

const EnhancedSourceForm = connect(mapStateToProps)(SourceForm);

export { EnhancedSourceForm as SourceForm };
