/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { ApolloError } from 'apollo-client';
import { Query } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import {
  GetUsersQuery as GetUsersQueryData,
  GetUsersQueryVariables,
} from '../operation-result-types';
import { DeleteUser } from '../queries/mutations';
import { GetUsers } from '../queries/queries';
import Authorize from './Authorize';
import { SearchInput } from './forms/controls/SearchInput';
import Loading from './Loading';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';
import SpeakerAvatar from './SpeakerAvatar';

interface IProps {
  dispatch: Dispatch;
}

interface IUsersState {
  name: string | null;
  includeInactive: boolean;
  confirmDeleteModalUserId: string | null;
}

class GetUsersQuery extends Query<GetUsersQueryData, GetUsersQueryVariables> {}

class Users extends React.Component<IProps, IUsersState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      name: null,
      includeInactive: false,
      confirmDeleteModalUserId: null,
    };
  }

  private onSearchChange = (name: string) => {
    this.setState({ name });
  };

  private showConfirmDeleteModal = (confirmDeleteModalUserId: string) => () => {
    this.setState({ confirmDeleteModalUserId });
  };

  private hideConfirmDeleteModal = () => {
    this.setState({ confirmDeleteModalUserId: null });
  };

  private onDeleted = () => {
    this.props.dispatch(addFlashMessage('Uživatel byl úspěšně smazán.', 'success'));

    this.hideConfirmDeleteModal();
  };

  private onDeleteError = (error: ApolloError) => {
    this.props.dispatch(addFlashMessage('Doško k chybě při mazání uživatele', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  // tslint:disable-next-line:member-ordering
  public render() {
    const { confirmDeleteModalUserId } = this.state;

    return (
      <div role="main" style={{ marginTop: 15 }}>
        <Authorize permissions={['users:edit']}>
          <div className="float-right">
            <Link style={{ marginBottom: 20 }} className="btn btn-primary" to="/admin/users/new">
              Přidat nového člena týmu
            </Link>
          </div>
        </Authorize>

        <h3>Tým</h3>

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

            const confirmDeleteModalUser = props.data.users.find(
              (s) => s.id === confirmDeleteModalUserId,
            );

            return (
              <div>
                {confirmDeleteModalUser && (
                  <ConfirmDeleteModal
                    message={`Opravdu chcete smazat Uživatele ${
                      confirmDeleteModalUser.first_name
                    } ${confirmDeleteModalUser.last_name}?`}
                    onCancel={this.hideConfirmDeleteModal}
                    mutation={DeleteUser}
                    mutationProps={{
                      variables: { id: confirmDeleteModalUserId },
                      refetchQueries: [
                        {
                          query: GetUsers,
                          variables: {
                            name: this.state.name,
                            includeInactive: this.state.includeInactive,
                          },
                        },
                      ],
                      onCompleted: this.onDeleted,
                      onError: this.onDeleteError,
                    }}
                  />
                )}

                {props.data.users.map((user) => (
                  <div className="card" key={user.id} style={{ marginBottom: '1rem' }}>
                    <div className="card-body" style={{ display: 'flex' }}>
                      <div style={{ flex: '0 0 106px' }}>
                        <SpeakerAvatar
                          avatar={user.avatar}
                          first_name={user.first_name || ''}
                          last_name={user.last_name || ''}
                        />
                      </div>

                      <div style={{ marginLeft: 15, flex: '1 0' }}>
                        <Authorize permissions={['users:edit']}>
                          <div style={{ float: 'right' }}>
                            <Link
                              to={`/admin/users/edit/${user.id}`}
                              className="btn btn-secondary"
                              style={{ marginRight: 15 }}
                            >
                              Upravit
                            </Link>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={this.showConfirmDeleteModal(user.id)}
                            >
                              Smazat
                            </button>
                          </div>
                        </Authorize>

                        <h5 style={{ marginTop: 7 }}>
                          {user.first_name} {user.last_name}{' '}
                          {!user.active && <small>(Uživatel není aktivní)</small>}
                        </h5>

                        <dl style={{ marginTop: 20 }}>
                          <dt className="text-muted">
                            <small>PŘÍSTUPOVÁ PRÁVA</small>
                          </dt>
                          <dd>{user.role.name}</dd>
                        </dl>

                        <dl style={{ marginTop: 20 }}>
                          <dt className="text-muted">
                            <small>BIO</small>
                          </dt>
                          <dd>{user.bio}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          }}
        </GetUsersQuery>
      </div>
    );
  }
}

export default connect()(Users);
