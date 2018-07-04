/* eslint camelcase: 0, react/sort-comp: 0 */

import * as React from 'react';
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
          <div style={{ paddingBottom: 50 }}>
            <div className="float-right">
              <Link to="/admin/speakers" className="btn btn-secondary">
                Zpět
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginLeft: 7 }}
                disabled={submitting}
              >
                {submitting ? 'Ukládám ...' : 'Uložit'}
              </button>
            </div>

            <h3 style={{ marginBottom: 25 }}>{title}</h3>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="first_name">Jméno:</label>
                <input
                  required
                  className="form-control"
                  id="first_name"
                  placeholder="Zadejte jméno"
                  defaultValue={defaultValues.first_name}
                  onChange={onInputChange('first_name')}
                />
              </div>

              <div className="form-group col-md-6">
                <label htmlFor="last_name">Přijmení</label>
                <input
                  required
                  className="form-control"
                  id="last_name"
                  placeholder="Zadejte přijmení"
                  defaultValue={defaultValues.last_name}
                  onChange={onInputChange('last_name')}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-12">
                <ImageInput
                  // label="Portrét"
                  // name="avatar"
                  defaultValue={defaultValues.avatar}
                  onChange={onImageChange('avatar')}
                  renderImage={(src) => <SpeakerAvatar avatar={src} />}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="illustration">Respektovaný odkaz (wiki, nasipolitici):</label>
                <input
                  className="form-control"
                  id="website_url"
                  placeholder="Zadejte odkaz"
                  defaultValue={defaultValues.website_url || undefined}
                  onChange={onInputChange('website_url')}
                />
              </div>
            </div>

            <MembershipForm
              memberships={defaultValues.memberships}
              onChange={onAssociationChange('memberships')}
            />
          </div>
        )}
      </SpeakerFormInternal>
    );
  }
}
