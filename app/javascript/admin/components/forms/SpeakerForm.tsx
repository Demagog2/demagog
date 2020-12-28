/* eslint camelcase: 0, react/sort-comp: 0 */

import * as React from 'react';

import { Button, Classes, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { FieldArray, Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

import { GetSpeaker as GetSpeakerQuery, SpeakerInput } from '../../operation-result-types';
import SpeakerAvatar from '../SpeakerAvatar';
import BodySelect from './controls/BodySelect';
import DateField from './controls/DateField';
import ImageField, { ImageValueType } from './controls/ImageField';
import SelectComponentField from './controls/SelectComponentField';
import TextField from './controls/TextField';
import FormGroup from './FormGroup';

export interface ISpeakerFormData extends SpeakerInput {
  avatar: ImageValueType;
}

interface ISpeakerFormProps {
  speaker?: GetSpeakerQuery['speaker'];
  onSubmit: (formData: ISpeakerFormData) => Promise<any>;
  title: string;
}

export class SpeakerForm extends React.Component<ISpeakerFormProps> {
  public render() {
    const { speaker, title } = this.props;

    const initialValues = {
      first_name: speaker ? speaker.firstName : '',
      last_name: speaker ? speaker.lastName : '',
      avatar: speaker ? speaker.avatar : null,
      website_url: speaker ? speaker.websiteUrl : '',
      memberships: speaker
        ? (speaker.memberships || []).map((m) => ({
            id: m.id,
            body_id: m.body.id,
            since: m.since,
            until: m.until,
          }))
        : [],
      osoba_id: speaker ? speaker.osobaId : null,
      wikidata_id: speaker ? speaker.wikidataId : null,
    };

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={yup.object().shape({
          first_name: yup.string().required('Je třeba vyplnit jméno'),
          last_name: yup.string().required('Je třeba vyplnit příjmení'),
          memberships: yup.array().of(
            yup.object().shape({
              body_id: yup.mixed().notOneOf([null], 'Je třeba vybrat stranu či skupinu'),
            }),
          ),
        })}
        onSubmit={(values, { setSubmitting }) => {
          const formData: ISpeakerFormData = {
            avatar: values.avatar,
            firstName: values.first_name,
            lastName: values.last_name,
            memberships: values.memberships.map((m) => ({
              id: m.id,
              bodyId: m.body_id,
              since: m.since,
              until: m.until,
            })),
            websiteUrl: values.website_url,
            wikidataId: cleanWikidataOrOsobaId(values.wikidata_id),
            osobaId: cleanWikidataOrOsobaId(values.osoba_id),
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
              <Link to="/admin/speakers" className={Classes.BUTTON}>
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

                <FormGroup label="Portrét" name="avatar" optional>
                  <ImageField name="avatar" renderImage={(src) => <SpeakerAvatar avatar={src} />} />
                </FormGroup>

                <div style={{ display: 'flex' }}>
                  <div style={{ flex: '1 1' }}>
                    <FormGroup label="Wikidata ID" name="wikidata_id" optional>
                      <>
                        <TextField name="wikidata_id" />
                        <div className={Classes.FORM_HELPER_TEXT}>
                          Používá se pro párování s jinými zdroji jako například Hlídač státu,
                          vyplňujte prosím. Wikidata ID získáte najitím stránky politika na
                          Wikipedii a kliknutím na "Položka Wikidat" vlevo. Je to ten kód začínající
                          velkým Q a pokračující číslem, např. Q939539.
                        </div>
                      </>
                    </FormGroup>
                  </div>
                  <div style={{ flex: '1 1', marginLeft: 15 }}>
                    <FormGroup label="Hlídač státu OsobaID" name="osoba_id" optional>
                      <>
                        <TextField name="osoba_id" />
                        <div className={Classes.FORM_HELPER_TEXT}>
                          Dřív se OsobaID používalo pro párování s osobami na Hlídači státu. Od
                          října 2020 se graduálně posouváme k párování přes Wikidata ID, tím pádem
                          již toto pole není třeba pro nové osoby vyplňovat.
                        </div>
                      </>
                    </FormGroup>
                  </div>
                </div>

                <FormGroup
                  label="Respektovaný odkaz (wiki, nasipolitici)"
                  name="website_url"
                  optional
                >
                  <TextField name="website_url" placeholder="http://www…" />
                </FormGroup>
              </div>
            </div>
            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ flex: '0 0 200px' }}>
                <h4 className={Classes.HEADING}>Příslušnost ke stranám/skupinám</h4>
              </div>
              <div style={{ flex: '1 1' }}>
                <FieldArray
                  name="memberships"
                  render={(arrayHelpers) => (
                    <div>
                      {values.memberships.map((_0, index) => (
                        <div key={index} style={{ display: 'flex' }}>
                          <div style={{ flex: '1 1 300px' }}>
                            <FormGroup label="Strana/skupina" name={`memberships.${index}.body_id`}>
                              <SelectComponentField name={`memberships.${index}.body_id`}>
                                {(renderProps) => <BodySelect {...renderProps} />}
                              </SelectComponentField>
                            </FormGroup>
                          </div>
                          <div style={{ flex: '0 1 190px', marginLeft: 15 }}>
                            <FormGroup label="Od" name={`memberships.${index}.since`} optional>
                              <DateField name={`memberships.${index}.since`} />
                            </FormGroup>
                          </div>
                          <div style={{ flex: '0 1 190px', marginLeft: 15 }}>
                            <FormGroup label="Do" name={`memberships.${index}.until`} optional>
                              <DateField name={`memberships.${index}.until`} />
                            </FormGroup>
                          </div>
                          <div style={{ flex: '0 0 30px', marginLeft: 15, paddingTop: 15 }}>
                            <Button
                              icon={IconNames.TRASH}
                              onClick={() => arrayHelpers.remove(index)}
                              minimal
                              title="Odstranit příslušnost"
                            />
                          </div>
                        </div>
                      ))}
                      <Button
                        onClick={() =>
                          arrayHelpers.push({ body_id: null, since: null, until: null })
                        }
                        icon={IconNames.PLUS}
                        text="Přidat příslušnost ke straně nebo skupině"
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

const cleanWikidataOrOsobaId = (input: string | null): string | null => {
  if (input === null) {
    return null;
  }
  const trimmed = input.trim();
  return trimmed !== '' ? trimmed : null;
};
