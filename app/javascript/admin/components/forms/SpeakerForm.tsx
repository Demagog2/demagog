/* eslint camelcase: 0, react/sort-comp: 0 */

import * as React from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';

import { v4 as uuid } from 'uuid';

import Loading from '../Loading';
import { GetSpeakerQuery, SpeakerInputType, GetSpeakerBodiesQuery } from '../../operation-result-types';
import { GetSpeakersBodies } from '../../queries/queries';
import { IMembership, MembershipForm } from './MembershipForm';

interface ISpeakerFormProps {
  speakerQuery?: GetSpeakerQuery;
  onSubmit: (body: SpeakerInputType) => void;
  submitting: boolean;
}

interface ISpeakerFields {
  first_name?: string;
  last_name?: string;
  website_url?: string;
}

interface ISpeakerFormState extends ISpeakerFields {
  isFormValidated: boolean;

  memberships: IMembership[];
}

function createMembership(body_id: string): IMembership {
  return {
    key: uuid(),
    id: null,
    body_id,
    since: null,
    until: null,
  };
}

// tslint:disable-next-line:max-classes-per-file
export class SpeakerForm extends React.Component<ISpeakerFormProps, ISpeakerFormState> {
  public static defaultProps = {
    speakerQuery: {
      speaker: {
        id: '',

        first_name: '',
        last_name: '',
        website_url: '',

        party: {
          id: '',
          name: '',
        },

        memberships: [],
      },
    },
  };

  constructor(props: ISpeakerFormProps) {
    super(props);

    if (props.speakerQuery) {
      this.state = {
        isFormValidated: false,

        first_name: props.speakerQuery.speaker.first_name,
        last_name: props.speakerQuery.speaker.last_name,
        website_url: props.speakerQuery.speaker.website_url,

        memberships: props.speakerQuery.speaker.memberships.map((m) => ({
          key: uuid(),
          id: m.id,
          body_id: m.body.id,
          since: m.since,
          until: m.until
        })),
      };
    }
  }

  // TODO: Replace any with specific event type
  private onSubmit = (evt: any) => {
    evt.preventDefault();

    const isValid = evt.target.checkValidity();

    if (isValid) {
      this.props.onSubmit(this.getFormValues());
    }

    this.setState({ isFormValidated: true });
  };

  private onChange = (name: keyof ISpeakerFields) => (evt: React.ChangeEvent<HTMLInputElement>) => {
    const state: { [P in keyof ISpeakerFields]: string } = {
      [name]: evt.target.value,
    };

    this.setState(state);
  };

  private getFormValues(): SpeakerInputType {
    const { first_name, last_name, website_url, memberships } = this.state;

    return {
      first_name: first_name || '',
      last_name: last_name || '',
      website_url: website_url || '',
      memberships: memberships.map((m) => ({
        id: m.id ? parseInt(m.id, 10) : null,
        body_id: m.body_id ? parseInt(m.body_id, 10) : 0,
        since: m.since,
        until: m.until
      })),
    };
  }

  private addMembership = (bodiesQuery: GetSpeakerBodiesQuery) => (evt) => {
    const defaultBody = bodiesQuery.bodies[0]

    this.setState({
      memberships: [...this.state.memberships, createMembership(defaultBody.id)],
    });

    evt.preventDefault();
  };

  private removeMembership = (removedKey: string) => (evt) => {
    const memberships = this.state.memberships.filter((membership) => {
      return membership.key !== removedKey;
    });

    this.setState({ memberships });

    evt.preventDefault();
  };

  private updateMembership = (updatedKey: string) => (updatedMembership: IMembership) => {
    const memberships = this.state.memberships.map((membership) => {
      if (membership.key === updatedKey) {
        return {
          key: updatedKey,
          ...updatedMembership,
        };
      }

      return membership;
    });

    this.setState({ memberships });
  };

  // tslint:disable-next-line:member-ordering
  public render() {
    const { speakerQuery, submitting } = this.props;

    if (!speakerQuery) {
      return null;
    }

    return (
      <form
        className={this.state.isFormValidated ? 'was-validated' : ''}
        noValidate
        onSubmit={this.onSubmit}
      >
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="first_name">Jméno:</label>
            <input
              required
              className="form-control"
              id="first_name"
              placeholder="Zadejte jméno"
              defaultValue={speakerQuery.speaker.first_name}
              onChange={this.onChange('first_name')}
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
              onChange={this.onChange('last_name')}
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
              onChange={this.onChange('website_url')}
            />
          </div>
        </div>

        <Query query={GetSpeakersBodies}>
          {({ data, loading }) => {
            if (loading) {
              return <Loading />;
            }

            if (!data) {
              return null;
            }

            return (
              <div className="form-row">
                {this.state.memberships.map((m) => (
                  <MembershipForm
                    key={m.key}
                    membership={m}
                    bodies={data.bodies}
                    onRemove={this.removeMembership(m.key)}
                    onChange={this.updateMembership(m.key)}
                  />
                ))}
                <button onClick={this.addMembership(data)} className="btn btn-secondary">
                  Přidat příslušnost ke straně nebo skupině
                </button>
              </div>
            );
          }}
        </Query>

        <div className="form-row" style={{ marginTop: 20 }}>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Ukládám ...' : 'Uložit'}
          </button>
          <Link to="/admin/speakers" className="btn">
            Zpět na seznam
          </Link>
        </div>
      </form>
    );
  }
}
