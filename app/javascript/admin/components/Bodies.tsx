/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { ApolloError } from 'apollo-client';
import { debounce } from 'lodash';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import {
  GetBodiesQuery as GetBodiesQueryResult,
  GetBodiesQueryVariables,
} from '../operation-result-types';
import { DeleteBody } from '../queries/mutations';
import { GetBodies } from '../queries/queries';
import BodyLogo from './BodyLogo';
import Loading from './Loading';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';

class GetBodiesQuery extends Query<GetBodiesQueryResult, GetBodiesQueryVariables> {}

function Badge(props: { is_party: boolean }) {
  if (props.is_party) {
    return <span className="badge badge-primary">Politická strana</span>;
  }

  return <span className="badge badge-secondary">Skupina</span>;
}

interface IProps {
  addFlashMessage: (msg: string) => void;
}

interface IState {
  name: string | null;
  confirmDeleteModalBodyId: string | null;
}

class Bodies extends React.Component<IProps, IState> {
  public state = {
    name: null,
    confirmDeleteModalBodyId: null,
  };

  private updateName = debounce((name: string) => this.setState({ name }), 500);

  private showConfirmDeleteModal = (confirmDeleteModalBodyId: string) => () => {
    this.setState({ confirmDeleteModalBodyId });
  };

  private hideConfirmDeleteModal = () => {
    this.setState({ confirmDeleteModalBodyId: null });
  };

  private onDeleted = () => {
    this.props.addFlashMessage('Skupina/strana byla úspěšně smazána.');
    this.hideConfirmDeleteModal();
  };

  private onDeleteError = (error: ApolloError) => {
    this.props.addFlashMessage('Doško k chybě při mazání skupiny/strany');

    console.error(error); // tslint:disable-line:no-console
  };

  // tslint:disable-next-line:member-ordering
  public render() {
    const { confirmDeleteModalBodyId } = this.state;

    return (
      <div>
        <h1>Strany a skupiny</h1>

        <Link style={{ marginBottom: 20 }} className="btn btn-primary" to="/admin/bodies/new">
          Přidat novou stranu / skupinu
        </Link>

        <input
          style={{ marginBottom: 20 }}
          className="form-control"
          type="search"
          placeholder="Vyhledat politickou stranu nebo skupinu"
          onChange={(evt) => this.updateName(evt.target.value)}
        />

        <GetBodiesQuery query={GetBodies} variables={{ name: this.state.name }}>
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
              <div>
                {confirmDeleteModalBody && (
                  <ConfirmDeleteModal
                    message={
                      'Opravdu chcete smazat skupinu/stranu ' + confirmDeleteModalBody.name + '?'
                    }
                    onCancel={this.hideConfirmDeleteModal}
                    mutation={DeleteBody}
                    mutationProps={{
                      variables: { id: confirmDeleteModalBodyId },
                      refetchQueries: [{ query: GetBodies, variables: { name: this.state.name } }],
                      onCompleted: this.onDeleted,
                      onError: this.onDeleteError,
                    }}
                  />
                )}

                {props.data.bodies.map((body) => (
                  <div className="card" key={body.id} style={{ marginBottom: '1rem' }}>
                    <div className="card-body" style={{ display: 'flex' }}>
                      <div style={{ flex: '0 0 106px' }}>
                        <BodyLogo logo={body.logo} name={body.name} />
                      </div>

                      <div style={{ marginLeft: 15, flex: '1 0' }}>
                        <div style={{ float: 'right' }}>
                          <Link
                            to={`/admin/bodies/edit/${body.id}`}
                            className="btn btn-secondary"
                            style={{ marginRight: 15 }}
                          >
                            Upravit
                          </Link>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={this.showConfirmDeleteModal(body.id)}
                          >
                            Smazat
                          </button>
                        </div>

                        <h5 className="card-title" style={{ marginTop: 7 }}>
                          {body.name} ({body.short_name})
                        </h5>

                        <div className="card-subtitle">
                          <Badge is_party={body.is_party} />
                        </div>

                        <dl style={{ marginTop: 10 }}>
                          <dt className="text-muted">
                            <small>RESPEKTOVANÝ ODKAZ</small>
                          </dt>
                          <dd>{body.link ? <a href={body.link}>{body.link}</a> : 'Nevyplněn'}</dd>

                          <dt className="text-muted">
                            <small>VZNIK</small>
                          </dt>
                          <dd>{body.founded_at ? body.founded_at : 'Nevyplněn'}</dd>

                          {body.is_inactive && (
                            <>
                              <dt className="text-muted">
                                <small>ZÁNIK</small>
                              </dt>
                              <dd>{body.terminated_at ? body.terminated_at : 'Nevyplněn'}</dd>
                            </>
                          )}
                        </dl>

                        {/*
                          TODO: description will be graudally removed (see github issue #65),
                          how do we show it during the transition?
                          <p className="card-text">{truncate(body.description, { length: 180 })}</p>
                        */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          }}
        </GetBodiesQuery>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addFlashMessage(message: string) {
      dispatch(addFlashMessage(message));
    },
  };
}

export default connect(null, mapDispatchToProps)(Bodies);
