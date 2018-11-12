/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { Button, Card, Classes, Intent, Tag } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { ApolloError } from 'apollo-client';
import * as classNames from 'classnames';
import { Query } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { Link } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import {
  GetBodiesQuery as GetBodiesQueryResult,
  GetBodiesQueryVariables,
} from '../operation-result-types';
import { DeleteBody } from '../queries/mutations';
import { GetBodies } from '../queries/queries';
import { displayDate } from '../utils';
import Authorize from './Authorize';
import BodyLogo from './BodyLogo';
import { SearchInput } from './forms/controls/SearchInput';
import Loading from './Loading';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';

class GetBodiesQuery extends Query<GetBodiesQueryResult, GetBodiesQueryVariables> {}

interface IProps extends DispatchProp<any> {}

interface IState {
  search: string;
  confirmDeleteModalBodyId: string | null;
}

class Bodies extends React.Component<IProps, IState> {
  public state = {
    search: '',
    confirmDeleteModalBodyId: null,
  };

  private onSearchChange = (search: string) => {
    this.setState({ search });
  };

  private showConfirmDeleteModal = (confirmDeleteModalBodyId: string) => () => {
    this.setState({ confirmDeleteModalBodyId });
  };

  private hideConfirmDeleteModal = () => {
    this.setState({ confirmDeleteModalBodyId: null });
  };

  private onDeleted = () => {
    this.props.dispatch(addFlashMessage('Skupina/strana byla úspěšně smazána.', 'success'));
    this.hideConfirmDeleteModal();
  };

  private onDeleteError = (error: ApolloError) => {
    this.props.dispatch(addFlashMessage('Doško k chybě při mazání skupiny/strany', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  // tslint:disable-next-line:member-ordering
  public render() {
    const { confirmDeleteModalBodyId } = this.state;

    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <Authorize permissions={['bodies:edit']}>
          <div style={{ float: 'right' }}>
            <Link
              className={classNames(
                Classes.BUTTON,
                Classes.INTENT_PRIMARY,
                Classes.iconClass(IconNames.PLUS),
              )}
              to="/admin/bodies/new"
            >
              Přidat novou stranu / skupinu
            </Link>
          </div>
        </Authorize>

        <h2 className={Classes.HEADING}>Strany a skupiny</h2>

        <div style={{ marginTop: 15 }}>
          <SearchInput
            placeholder="Hledat dle názvu…"
            onChange={this.onSearchChange}
            value={this.state.search}
          />
        </div>

        <GetBodiesQuery query={GetBodies} variables={{ name: this.state.search }}>
          {(props) => {
            if (props.loading) {
              return <Loading />;
            }

            if (props.error) {
              return <h1>{props.error}</h1>;
            }

            if (!props.data) {
              return null;
            }

            const confirmDeleteModalBody = props.data.bodies.find(
              (s) => s.id === confirmDeleteModalBodyId,
            );

            return (
              <div style={{ marginTop: 15 }}>
                {confirmDeleteModalBody && (
                  <ConfirmDeleteModal
                    message={`Opravdu chcete smazat skupinu/stranu ${confirmDeleteModalBody.name}?`}
                    onCancel={this.hideConfirmDeleteModal}
                    mutation={DeleteBody}
                    mutationProps={{
                      variables: { id: confirmDeleteModalBodyId },
                      refetchQueries: [
                        { query: GetBodies, variables: { name: this.state.search } },
                      ],
                      onCompleted: this.onDeleted,
                      onError: this.onDeleteError,
                    }}
                  />
                )}

                {props.data.bodies.map((body) => (
                  <Card key={body.id} style={{ marginBottom: 15 }}>
                    <div style={{ display: 'flex' }}>
                      <div style={{ flex: '0 0 106px', marginRight: 15 }}>
                        <BodyLogo logo={body.logo} name={body.name} />
                      </div>

                      <div style={{ flex: '1 1' }}>
                        <Authorize permissions={['bodies:edit']}>
                          <div style={{ float: 'right', display: 'flex' }}>
                            <Link
                              to={`/admin/bodies/edit/${body.id}`}
                              className={classNames(
                                Classes.BUTTON,
                                Classes.iconClass(IconNames.EDIT),
                              )}
                            >
                              Upravit
                            </Link>
                            <Button
                              icon={IconNames.TRASH}
                              onClick={this.showConfirmDeleteModal(body.id)}
                              title="Smazat"
                              style={{ marginLeft: 7 }}
                            />
                          </div>
                        </Authorize>

                        <h5 className={Classes.HEADING}>
                          {body.name} ({body.short_name})
                        </h5>

                        {body.is_party ? (
                          <Tag intent={Intent.PRIMARY}>Politická strana</Tag>
                        ) : (
                          <Tag>Skupina</Tag>
                        )}

                        <ul className={Classes.LIST_UNSTYLED} style={{ marginTop: 15 }}>
                          <li>
                            <span className={Classes.TEXT_MUTED}>Respektovaný odkaz: </span>
                            <p>{body.link ? <a href={body.link}>{body.link}</a> : 'Nevyplněn'}</p>
                          </li>
                          <li>
                            <span className={Classes.TEXT_MUTED}>Vznik: </span>
                            <p>{body.founded_at ? displayDate(body.founded_at) : 'Nevyplněn'}</p>
                          </li>
                          {body.terminated_at && (
                            <li>
                              <span className={Classes.TEXT_MUTED}>Zánik: </span>
                              <p>{displayDate(body.terminated_at)}</p>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </Card>
                ))}

                {props.data.bodies.length === 0 &&
                  this.state.search !== '' && (
                    <p>Nenašli jsme žádnou stranu či skupinu s názvem „{this.state.search}‟.</p>
                  )}
              </div>
            );
          }}
        </GetBodiesQuery>
      </div>
    );
  }
}

export default connect()(Bodies);
