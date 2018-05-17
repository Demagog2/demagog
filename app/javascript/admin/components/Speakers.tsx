/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { debounce } from 'lodash';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';

import { GetSpeakers } from '../queries/queries';
import Loading from './Loading';
import SpeakerAvatar from './SpeakerAvatar';

// TODO: Replace by generated interface
interface ISpeaker {
  id: number;
  first_name: string;
  last_name: string;
  website_url: string;
  avatar: string;
  body: {
    short_name: string;
  };
}

interface ISpeakersState {
  name: string | null;
  speakerId: number;
}

export default class Bodies extends React.Component<{}, ISpeakersState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      name: null,
      speakerId: -1,
    };
  }

  private updateName = debounce((name: string) => this.setState({ name }), 500);

  // tslint:disable-next-line:member-ordering
  public render() {
    return (
      <React.Fragment>
        <div>
          <h1>Lidé</h1>

          <Link style={{ marginBottom: 20 }} className="btn btn-primary" to="/admin/speakers/new">
            Přidat novou osobu
          </Link>

          <input
            style={{ marginBottom: 20 }}
            className="form-control"
            type="search"
            placeholder="Vyhledat politickou osobu"
            onChange={(evt) => this.updateName(evt.target.value)}
          />

          <Query query={GetSpeakers} variables={{ name: this.state.name }}>
            {(props) => {
              if (props.loading) {
                return <Loading />;
              }

              if (props.error) {
                return <h1>{props.error}</h1>;
              }

              return (
                <div>
                  {props.data.speakers.map((speaker: ISpeaker) => (
                    <div className="card" key={speaker.id} style={{ marginBottom: '1rem' }}>
                      <Link
                        to={`/admin/speakers/edit/${speaker.id}`}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          height: '100%',
                          width: '100%',
                        }}
                      />

                      <div className="card-body" style={{ display: 'flex' }}>
                        <div style={{ flex: '0 0 106px' }}>
                          <SpeakerAvatar
                            avatar={speaker.avatar}
                            first_name={speaker.first_name}
                            last_name={speaker.last_name}
                          />
                        </div>

                        <div style={{ marginLeft: 15 }}>
                          <h5>
                            {speaker.first_name} {speaker.last_name}
                          </h5>

                          <h6>{speaker.body ? speaker.body.short_name : 'Nestraník'}</h6>
                        </div>

                        {speaker.website_url && (
                          <a href={speaker.website_url}>{speaker.website_url}</a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            }}
          </Query>
        </div>
      </React.Fragment>
    );
  }
}
