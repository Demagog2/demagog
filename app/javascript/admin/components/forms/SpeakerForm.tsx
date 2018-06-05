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
    const { speakerQuery, submitting } = this.props;

    if (!speakerQuery) {
      return null;
    }

    return (
      <SpeakerFormInternal defaultValues={speakerQuery.speaker} onSubmit={this.props.onSubmit}>
        {({ onInputChange, onImageChange, onAssociationChange }) => (
          <React.Fragment>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="first_name">Jméno:</label>
                <input
                  required
                  className="form-control"
                  id="first_name"
                  placeholder="Zadejte jméno"
                  defaultValue={speakerQuery.speaker.first_name}
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
                  defaultValue={speakerQuery.speaker.last_name}
                  onChange={onInputChange('last_name')}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group col-md-12">
                <ImageInput
                  label="Portrét"
                  name="avatar"
                  defaultValue={speakerQuery.speaker.avatar}
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
                  defaultValue={speakerQuery.speaker.website_url}
                  onChange={onInputChange('website_url')}
                />
              </div>
            </div>

            <MembershipForm
              memberships={speakerQuery.speaker.memberships}
              onChange={onAssociationChange('memberships')}
            />

            <div style={{ marginTop: 20 }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Ukládám ...' : 'Uložit'}
              </button>
              <Link to="/admin/speakers" className="btn">
                Zpět na seznam
              </Link>
            </div>
          </React.Fragment>
        )}
      </SpeakerFormInternal>
    );
  }
}
