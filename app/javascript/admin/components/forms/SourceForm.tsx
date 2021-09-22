/* eslint camelcase: 0 */

import * as React from 'react';

import { Button, Classes, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { FieldArray, Form, Formik } from 'formik';
import { DateTime } from 'luxon';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { cx } from 'emotion';

import * as ResultTypes from '../../operation-result-types';
import { IState as ReduxState } from '../../reducers';
import DateField from './controls/DateField';
import MediaPersonalitiesSelect from './controls/MediaPersonalitySelect';
import MediumSelect from './controls/MediumSelect';
import SelectComponentField from './controls/SelectComponentField';
import SpeakerSelect from './controls/SpeakerSelect';
import TextareaField from './controls/TextareaField';
import TextField from './controls/TextField';
import UserSelect from './controls/UserSelect';
import FormGroup from './FormGroup';
import SpeakerAvatar from '../SpeakerAvatar';
import BodySelect from './controls/BodySelect';

interface ISourceFormProps {
  backPath: string;
  source?: ResultTypes.GetSource['source'];
  onSubmit: (formData: ResultTypes.SourceInput) => Promise<any>;
  title: string;
}

export const SourceForm = (props: ISourceFormProps) => {
  const currentUser = useSelector((state: ReduxState) => state.currentUser.user);

  const { backPath, onSubmit, source, title } = props;

  const initialValues = React.useMemo(() => {
    const iv = {
      name: source?.name ?? '',
      medium_id: source?.medium?.id,
      media_personalities: source?.mediaPersonalities?.map((p) => p.id) ?? [],
      released_at: source?.releasedAt ?? DateTime.local().toISODate(),
      source_url: source?.sourceUrl ?? '',
      source_speakers:
        source?.sourceSpeakers?.map((s) => ({
          id: s.id,
          speaker_id: s.speaker.id,
          avatar: s.speaker.avatar,
          first_name: s.firstName,
          last_name: s.lastName,
          role: s.role,
          body_id: s.body ? s.body.id : null,
        })) ?? [],
      transcript: source?.transcript ?? '',
      experts: source?.experts?.map((u) => u.id) ?? [],
    };

    // When creating new source, prefill experts with the current user
    if (!source && currentUser) {
      iv.experts = [currentUser.id];
    }

    return iv;
  }, [currentUser, source]);

  const onSubmitHandler = React.useCallback(
    (values, { setSubmitting }) => {
      const formData: ResultTypes.SourceInput = {
        name: values.name,
        sourceUrl: values.source_url,
        sourceSpeakers: values.source_speakers.map((sourceSpeakerValues) => ({
          id: sourceSpeakerValues.id,
          speakerId: sourceSpeakerValues.speaker_id,
          firstName: sourceSpeakerValues.first_name,
          lastName: sourceSpeakerValues.last_name,
          role: sourceSpeakerValues.role,
          bodyId: sourceSpeakerValues.body_id,
        })),
        transcript: values.transcript,
        mediaPersonalities: values.media_personalities,
        // medium_id will always be a string, because null won't pass validation
        mediumId: values.medium_id as string,
        // released_at will always be a string, because null won't pass validation
        releasedAt: values.released_at as string,
        experts: values.experts,
      };

      onSubmit(formData)
        .then(() => {
          setSubmitting(false);
        })
        .catch(() => {
          setSubmitting(false);
        });
    },
    [onSubmit],
  );

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={yup.object().shape({
        name: yup.string().required('Je třeba vyplnit název'),
        medium_id: yup.string().nullable(),
        released_at: yup.string().nullable(),
        speakers: yup.array().nullable(),
      })}
      onSubmit={onSubmitHandler}
    >
      {({ isSubmitting, values }) => (
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
              <p>
                Stranu/skupinu můžete vybrat specificky jen pro tuto diskuzi, například pokud je
                řečník součástí jiné na komunální a národní úrovni a hodí se pro tuto diskuzi vybrat
                spíše komunální příslušnost. Podobně lze upravovat i funkci jen pro tuto diskuzi.
              </p>
            </div>
            <div style={{ flex: '1 1' }}>
              <FieldArray
                name="source_speakers"
                render={(arrayHelpers) => (
                  <table
                    className={cx(Classes.HTML_TABLE, Classes.HTML_TABLE_STRIPED)}
                    style={{ width: '100%' }}
                  >
                    <tbody>
                      {values.source_speakers.map((_, index) => (
                        <tr key={index}>
                          <td>
                            <SpeakerAvatar
                              avatar={values.source_speakers[index].avatar}
                              first_name=""
                              last_name=""
                            />
                          </td>
                          <td>
                            <div style={{ display: 'flex' }}>
                              <div style={{ flex: '1 1' }}>
                                <FormGroup
                                  name={`source_speakers.${index}.first_name`}
                                  label="Křestní jméno"
                                >
                                  <TextField
                                    name={`source_speakers.${index}.first_name`}
                                    disabled
                                  />
                                </FormGroup>
                              </div>
                              <div style={{ flex: '1 1', marginLeft: 15 }}>
                                <FormGroup
                                  name={`source_speakers.${index}.last_name`}
                                  label="Příjmení"
                                >
                                  <TextField name={`source_speakers.${index}.last_name`} disabled />
                                </FormGroup>
                              </div>
                            </div>
                            <FormGroup
                              label="Strana/skupina"
                              name={`source_speakers.${index}.body_id`}
                            >
                              <SelectComponentField name={`source_speakers.${index}.body_id`}>
                                {(renderProps) => <BodySelect isClearable {...renderProps} />}
                              </SelectComponentField>
                            </FormGroup>
                            <FormGroup name={`source_speakers.${index}.role`} label="Funkce">
                              <>
                                <TextField name={`source_speakers.${index}.role`} />
                                <div className={Classes.FORM_HELPER_TEXT}>
                                  Funkce osoby v čase této diskuze, např. "Předseda vlády ČR" nebo
                                  "Ministryně práce a sociálních věcí". Pište s velkým písmenem na
                                  začátku. Funkce by neměla být delší než 40 znaků.
                                </div>
                              </>
                            </FormGroup>
                          </td>
                          <td>
                            <Button
                              icon={IconNames.TRASH}
                              onClick={() => arrayHelpers.remove(index)}
                              minimal
                              title="Odstranit osobu"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3}>
                          <AddSourceSpeakerControls
                            onAdd={(speaker: ResultTypes.GetSpeakersForSelect_speakers) =>
                              arrayHelpers.push({
                                id: null,
                                speaker_id: speaker.id,
                                avatar: speaker.avatar,
                                first_name: speaker.firstName,
                                last_name: speaker.lastName,
                                role: speaker.role,
                                body_id: speaker.body ? speaker.body.id : null,
                              })
                            }
                          />
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              />
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
                Je-li dostupný, doporučujeme vyplnit, protože usnaďňuje vytváření výroků označováním
                v přepisu.
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
};

const AddSourceSpeakerControls = ({ onAdd }) => {
  const [
    selectedSpeaker,
    setSelectedSpeaker,
  ] = React.useState<ResultTypes.GetSpeakersForSelect_speakers | null>(null);

  const handleAddClick = React.useCallback(() => {
    if (selectedSpeaker) {
      onAdd(selectedSpeaker);
      setSelectedSpeaker(null);
    }
  }, [onAdd, selectedSpeaker, setSelectedSpeaker]);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: '0 0 350px' }}>
        <SpeakerSelect
          value={selectedSpeaker ? String(selectedSpeaker.id) : null}
          onChange={(_, speaker) => {
            setSelectedSpeaker(speaker);
          }}
        />
      </div>
      <div style={{ flex: '0 0 auto', marginLeft: 15 }}>
        <Button onClick={() => handleAddClick()} icon={IconNames.PLUS} text="Přidat" />
      </div>
    </div>
  );
};
