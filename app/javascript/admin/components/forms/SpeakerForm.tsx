/* eslint camelcase: 0, react/sort-comp: 0 */

import * as React from 'react';

import { Button, Classes, FormGroup, Intent } from '@blueprintjs/core';
import * as classNames from 'classnames';
import { Link } from 'react-router-dom';

import { GetSpeakerQuery, SpeakerInputType } from '../../operation-result-types';
import SpeakerAvatar from '../SpeakerAvatar';
import ImageInput, { ImageValueType } from './controls/ImageInput';
import { Form } from './Form';

import { MembershipForm } from './MembershipForm';

export interface ISpeakerFormData extends SpeakerInputType {
  avatar: ImageValueType;
}

class SpeakerFormInternal extends Form<ISpeakerFormData> {}

interface ISpeakerFormProps {
  speakerQuery?: GetSpeakerQuery;
  onSubmit: (formData: ISpeakerFormData) => void;
  submitting: boolean;
  title: string;
}

// tslint:disable-next-line:max-classes-per-file
export class SpeakerForm extends React.Component<ISpeakerFormProps> {
  public static defaultProps = {
    speakerQuery: {
      speaker: {
        id: '',

        first_name: '',
        last_name: '',
        avatar: null,
        website_url: '',

        memberships: [],
      },
    },
  };

  public render() {
    const { speakerQuery, submitting, title } = this.props;

    if (!speakerQuery) {
      return null;
    }

    const defaultValues: ISpeakerFormData = {
      first_name: speakerQuery.speaker.first_name,
      last_name: speakerQuery.speaker.last_name,
      avatar: speakerQuery.speaker.avatar,
      website_url: speakerQuery.speaker.website_url,
      memberships: speakerQuery.speaker.memberships.map((m) => ({
        id: m.id,
        since: m.since,
        until: m.until,
        body: {
          id: m.body.id,
        },
      })),
    };

    return (
      <SpeakerFormInternal defaultValues={defaultValues} onSubmit={this.props.onSubmit}>
        {({ onInputChange, onImageChange, onAssociationChange }) => (
          <div>
            <div style={{ float: 'right' }}>
              <Link to="/admin/speakers" className={Classes.BUTTON}>
                Zpět
              </Link>
              <Button
                type="submit"
                intent={Intent.PRIMARY}
                style={{ marginLeft: 7 }}
                disabled={submitting}
                text={submitting ? 'Ukládám ...' : 'Uložit'}
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
                    <FormGroup label="Jméno" labelFor="first-name">
                      <input
                        id="first-name"
                        className={classNames(Classes.INPUT, Classes.FILL)}
                        type="text"
                        dir="auto"
                        defaultValue={defaultValues.first_name}
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
                        defaultValue={defaultValues.last_name}
                        onChange={onInputChange('last_name')}
                      />
                    </FormGroup>
                  </div>
                </div>

                <FormGroup label="Portrét">
                  <ImageInput
                    defaultValue={defaultValues.avatar}
                    onChange={onImageChange('avatar')}
                    renderImage={(src) => <SpeakerAvatar avatar={src} />}
                  />
                </FormGroup>

                <FormGroup label="Respektovaný odkaz (wiki, nasipolitici)" labelFor="website-url">
                  <input
                    type="text"
                    dir="auto"
                    id="website-url"
                    placeholder="http://www…"
                    className={classNames(Classes.INPUT, Classes.FILL)}
                    defaultValue={defaultValues.website_url || undefined}
                    onChange={onInputChange('website_url')}
                  />
                </FormGroup>
              </div>
            </div>
            <div style={{ display: 'flex', marginTop: 30 }}>
              <div style={{ flex: '0 0 200px' }}>
                <h4>Příslušnost ke stranám/skupinám</h4>
              </div>
              <div style={{ flex: '1 1' }}>
                <MembershipForm
                  memberships={defaultValues.memberships}
                  onChange={onAssociationChange('memberships')}
                />
              </div>
            </div>
          </div>
        )}
      </SpeakerFormInternal>
    );
  }
}
