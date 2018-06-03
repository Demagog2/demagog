/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';

import {
  GetUsersQuery as GetUsersQueryData,
  GetUsersQueryVariables,
} from '../operation-result-types';
import { GetUsers } from '../queries/queries';
import { SearchInput } from './forms/controls/SearchInput';
import Loading from './Loading';
import SpeakerAvatar from './SpeakerAvatar';

interface IUsersState {
  name: string | null;
  includeInactive: boolean;
}

class GetUsersQuery extends Query<GetUsersQueryData, GetUsersQueryVariables> {}

export default class Users extends React.Component<{}, IUsersState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      name: null,
      includeInactive: false,
    };
  }

  private onSearchChange = (name: string) => {
    this.setState({ name });
  };

  // tslint:disable-next-line:member-ordering
  public render() {
    return (
      <React.Fragment>
        <div>
          <h1>Tým</h1>

          <Link style={{ marginBottom: 20 }} className="btn btn-primary" to="/admin/users/new">
            Přidat nového člena týmu
          </Link>

          <div className="input-group mb-3" style={{ marginBottom: 20 }}>
            <div className="input-group-prepend">
              <div className="input-group-text">
                <span style={{ marginRight: 20 }}>Zobrazit neaktivní členy</span>
                <input
                  type="checkbox"
                  onChange={(evt) => this.setState({ includeInactive: evt.target.checked })}
                  defaultChecked={this.state.includeInactive}
                />
              </div>
            </div>
            <SearchInput
              marginBottom={0}
              placeholder="Vyhledat člena týmu"
              onChange={this.onSearchChange}
            />
          </div>

          <GetUsersQuery
            query={GetUsers}
            variables={{ name: this.state.name, includeInactive: this.state.includeInactive }}
          >
            {(props) => {
              if (props.loading || !props.data) {
                return <Loading />;
              }

              if (props.error) {
                return <h1>{props.error}</h1>;
              }

              return (
                <div>
                  {props.data.users.map((user) => (
                    <div className="card" key={user.id} style={{ marginBottom: '1rem' }}>
                      <Link
                        to={`/admin/users/edit/${user.id}`}
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
                            avatar={user.avatar}
                            first_name={user.first_name || ''}
                            last_name={user.last_name || ''}
                          />
                        </div>

                        <div style={{ marginLeft: 15 }}>
                          <h5>
                            {user.first_name} {user.last_name}
                          </h5>

                          {!user.active && <small>Uživatel není aktivní</small>}

                          {user.bio && <p>Bio: {user.bio}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }}
          </GetUsersQuery>
        </div>
      </React.Fragment>
    );
  }
}
