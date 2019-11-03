/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { Button, Callout, Card, Classes, Colors, Switch } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { ApolloError } from 'apollo-client';
import * as classNames from 'classnames';
import { css } from 'emotion';
import { Mutation, Query } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { Link } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import {
  GetUsers as GetUsersQuery,
  GetUsersVariables as GetUsersQueryVariables,
} from '../operation-result-types';
import { DeleteUser, UpdateUserActiveness } from '../queries/mutations';
import { GetUsers } from '../queries/queries';
import { newlinesToBr } from '../utils';
import Authorize from './Authorize';
import { SearchInput } from './forms/controls/SearchInput';
import Loading from './Loading';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';
import SpeakerAvatar from './SpeakerAvatar';

interface IProps extends DispatchProp<any> {}

interface IUsersState {
  search: string;
  includeInactive: boolean;
  confirmDeleteModalUserId: string | null;
}

class Users extends React.Component<IProps, IUsersState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      search: '',
      includeInactive: false,
      confirmDeleteModalUserId: null,
    };
  }

  private onSearchChange = (search: string) => {
    this.setState({ search });
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
    if (error.message.match(/cannot be deleted if it is already linked/)) {
      this.props.dispatch(
        addFlashMessage(
          'Uživatele nelze smazat, protože už byl v systému aktivní. Deaktivujte jej.',
          'warning',
        ),
      );
      return;
    }

    this.props.dispatch(addFlashMessage('Doško k chybě při mazání uživatele', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  // tslint:disable-next-line:member-ordering
  public render() {
    const { confirmDeleteModalUserId } = this.state;

    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <Authorize permissions={['users:edit']}>
          <div style={{ float: 'right' }}>
            <Link className={Classes.BUTTON} to="/admin/users/sort-on-about-us-page" role="button">
              Seřadit na stránce „O nás“
            </Link>
            <Link
              className={classNames(
                Classes.BUTTON,
                Classes.INTENT_PRIMARY,
                Classes.iconClass(IconNames.PLUS),
                css`
                  margin-left: 7px;
                `,
              )}
              to="/admin/users/new"
              role="button"
            >
              Přidat nového člena týmu
            </Link>
          </div>
        </Authorize>

        <h2 className={Classes.HEADING}>Tým</h2>

        <div style={{ marginTop: 15 }}>
          <Switch
            checked={this.state.includeInactive}
            label="Zobrazit i deaktivované členy"
            onChange={(e) => this.setState({ includeInactive: e.currentTarget.checked })}
          />
          <SearchInput
            placeholder="Hledat dle jména…"
            value={this.state.search}
            onChange={this.onSearchChange}
          />
        </div>

        <Query<GetUsersQuery, GetUsersQueryVariables>
          query={GetUsers}
          variables={{ name: this.state.search, includeInactive: this.state.includeInactive }}
        >
          {(props) => {
            if (props.loading && (!props.data || !props.data.users)) {
              return <Loading />;
            }

            if (props.error) {
              return <h1>{props.error}</h1>;
            }

            if (!props.data || !props.data.users) {
              return null;
            }

            const deletedUser = props.data.users.find((s) => s.id === confirmDeleteModalUserId);
            const refetchUsers = () =>
              props.refetch({
                name: this.state.search,
                includeInactive: this.state.includeInactive,
              });

            return (
              <div style={{ marginTop: 15 }}>
                {deletedUser && (
                  <ConfirmDeleteModal
                    message={`Opravdu chcete smazat uživatele ${deletedUser.firstName} ${deletedUser.lastName}?`}
                    onCancel={this.hideConfirmDeleteModal}
                    mutation={DeleteUser}
                    mutationProps={{
                      variables: { id: confirmDeleteModalUserId },
                      refetchQueries: [
                        {
                          query: GetUsers,
                          variables: {
                            name: this.state.search,
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
                  <Card
                    key={user.id}
                    style={{
                      marginBottom: 15,
                      backgroundColor: user.active ? 'none' : Colors.LIGHT_GRAY4,
                    }}
                  >
                    <div style={{ display: 'flex' }}>
                      <div style={{ flex: '0 0 106px' }}>
                        <SpeakerAvatar
                          avatar={user.avatar}
                          first_name={user.firstName || ''}
                          last_name={user.lastName || ''}
                        />
                      </div>
                      <div style={{ flex: '1 1', marginLeft: 15 }}>
                        <Authorize permissions={['users:edit']}>
                          <div
                            style={{
                              float: 'right',
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <Link
                              to={`/admin/users/edit/${user.id}`}
                              className={classNames(
                                Classes.BUTTON,
                                Classes.iconClass(IconNames.EDIT),
                              )}
                            >
                              Upravit
                            </Link>
                            <Mutation<any, any>
                              optimisticResponse={false}
                              mutation={UpdateUserActiveness}
                              onCompleted={() => {
                                refetchUsers();
                                this.props.dispatch(
                                  addFlashMessage(
                                    'Uživatel úspěšně ' +
                                      (user.active ? 'aktivován' : 'deaktivován') +
                                      '.',
                                    'success',
                                  ),
                                );
                              }}
                              onError={() =>
                                this.props.dispatch(
                                  addFlashMessage(
                                    'Došlo k chybě při ' +
                                      (user.active ? 'deaktivaci' : 'aktivaci') +
                                      ' uživatele.',
                                    'error',
                                  ),
                                )
                              }
                            >
                              {(updateUserActiveness, { loading }) =>
                                user.active ? (
                                  <Button
                                    icon={IconNames.CROSS}
                                    style={{ marginLeft: 7 }}
                                    text="Deaktivovat"
                                    disabled={loading}
                                    onClick={() =>
                                      updateUserActiveness({
                                        variables: { id: Number(user.id), userActive: false },
                                      })
                                    }
                                  />
                                ) : (
                                  <Button
                                    icon={IconNames.TICK}
                                    style={{ marginLeft: 7 }}
                                    text="Aktivovat"
                                    disabled={loading}
                                    onClick={() =>
                                      updateUserActiveness({
                                        variables: { id: Number(user.id), userActive: true },
                                      })
                                    }
                                  />
                                )
                              }
                            </Mutation>
                            <Button
                              type="button"
                              icon={IconNames.TRASH}
                              style={{ marginLeft: 7 }}
                              onClick={this.showConfirmDeleteModal(user.id)}
                              title="Smazat"
                            />
                          </div>
                        </Authorize>

                        <h5 className={Classes.HEADING}>
                          {user.firstName} {user.lastName}
                        </h5>

                        <h6 className={Classes.HEADING}>{user.positionDescription}</h6>
                        <p>{user.bio && newlinesToBr(user.bio)}</p>

                        <Callout>
                          <span className={Classes.TEXT_MUTED}>Email: </span>
                          {user.email}
                          <br />
                          <span className={Classes.TEXT_MUTED}>Přístupová práva: </span>
                          {user.role.name}
                          <br />
                          <span className={Classes.TEXT_MUTED}>Posílat upozornění emailem: </span>
                          {user.emailNotifications ? 'Ano' : 'Ne'}
                          <br />
                          <span className={Classes.TEXT_MUTED}>Zobrazit v O nás:&nbsp;</span>
                          {user.userPublic ? 'Ano' : 'Ne'}
                        </Callout>
                      </div>
                    </div>
                  </Card>
                ))}

                {props.data.users.length === 0 && this.state.search !== '' && (
                  <p>Nenašli jsme žádného člena týmu se jménem „{this.state.search}“.</p>
                )}
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default connect()(Users);
