/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { debounce } from 'lodash';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';

import {
  GetUsersQuery as GetUsersQueryData,
  GetUsersQueryVariables,
} from '../operation-result-types';
import { GetUsers } from '../queries/queries';
import Loading from './Loading';
import SpeakerAvatar from './SpeakerAvatar';

interface IUsersState {
  name: string | null;
}

class GetUsersQuery extends Query<GetUsersQueryData, GetUsersQueryVariables> {}

export default class Users extends React.Component<{}, IUsersState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      name: null,
    };
  }

  private updateName = debounce((name: string) => this.setState({ name }), 500);

  // tslint:disable-next-line:member-ordering
  public render() {
    return (
      <React.Fragment>
        <div>
          <h1>Tým</h1>

          <Link style={{ marginBottom: 20 }} className="btn btn-primary" to="/admin/users/new">
            Přidat nového člena týmu
          </Link>

          <input
            style={{ marginBottom: 20 }}
            className="form-control"
            type="search"
            placeholder="Vyhledat člena týmu"
            onChange={(evt) => this.updateName(evt.target.value)}
          />

          <GetUsersQuery query={GetUsers} variables={{ name: this.state.name }}>
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
