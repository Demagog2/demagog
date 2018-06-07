/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

// import { ApolloError } from 'apollo-client';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { compact } from 'lodash';
import { addFlashMessage } from '../actions/flashMessages';
import {
  GetSourcesQuery as GetSourcesQueryResult,
  GetSourcesQueryVariables,
} from '../operation-result-types';
// import { DeleteSpeaker } from '../queries/mutations';
import { GetSources } from '../queries/queries';
import { SearchInput } from './forms/controls/SearchInput';
import Loading from './Loading';
// import ConfirmDeleteModal from './modals/ConfirmDeleteModal';
// import SpeakerAvatar from './SpeakerAvatar';

class GetSourcesQuery extends Query<GetSourcesQueryResult, GetSourcesQueryVariables> {}

interface IProps {
  addFlashMessage: (msg: string) => void;
}

interface IState {
  name: string | null;
  confirmDeleteModalSpeakerId: string | null;
}

class Speakers extends React.Component<IProps, IState> {
  public state = {
    name: null,
    confirmDeleteModalSpeakerId: null,
  };

  public getLink(source: any): string {
    return compact([
      source.medium ? source.medium.name : undefined,
      source.released_at,
      source.medium_personality ? source.medium_personality.name : undefined,
    ]).join(', ');
  }

  private onSearchChange = (name: string) => {
    this.setState({ name });
  };

  // private showConfirmDeleteModal = (confirmDeleteModalSpeakerId: string) => () => {
  //   this.setState({ confirmDeleteModalSpeakerId });
  // };

  // private hideConfirmDeleteModal = () => {
  //   this.setState({ confirmDeleteModalSpeakerId: null });
  // };

  // private onDeleted = () => {
  //   this.props.addFlashMessage('Osoba byla úspěšně smazána.');
  //   this.hideConfirmDeleteModal();
  // };

  // private onDeleteError = (error: ApolloError) => {
  //   this.props.addFlashMessage('Doško k chybě při mazání osoby');

  //   console.error(error); // tslint:disable-line:no-console
  // };

  // tslint:disable-next-line:member-ordering
  public render() {
    // const { confirmDeleteModalSpeakerId } = this.state;

    return (
      <React.Fragment>
        <div>
          <h1>Výroky</h1>

          <Link
            style={{ marginBottom: 20 }}
            className="btn btn-primary"
            to="/admin/statements/sources/new"
          >
            Přidat zdroj výroků
          </Link>

          <SearchInput placeholder="Vyhledat zdroj výroků" onChange={this.onSearchChange} />

          <GetSourcesQuery query={GetSources} variables={{ name: this.state.name }}>
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

              // const confirmDeleteModalSpeaker = props.data.speakers.find(
              //   (s) => s.id === confirmDeleteModalSpeakerId,
              // );

              return (
                <div>
                  {/* {confirmDeleteModalSpeaker && (
                    <ConfirmDeleteModal
                      message={`Opravdu chcete smazat osobu ${
                        confirmDeleteModalSpeaker.first_name
                      } ${confirmDeleteModalSpeaker.last_name}?`}
                      onCancel={this.hideConfirmDeleteModal}
                      mutation={DeleteSpeaker}
                      mutationProps={{
                        variables: { id: confirmDeleteModalSpeakerId },
                        refetchQueries: [
                          { query: GetSpeakers, variables: { name: this.state.name } },
                        ],
                        onCompleted: this.onDeleted,
                        onError: this.onDeleteError,
                      }}
                    />
                  )} */}

                  {props.data.sources.map((source) => (
                    <div className="card" key={source.id} style={{ marginBottom: '1rem' }}>
                      <div className="card-body" style={{ display: 'flex' }}>
                        <div style={{ marginLeft: 15, flex: '1 0' }}>
                          <div style={{ float: 'right' }}>
                            <Link
                              to={`/admin/statements/sources/edit/${source.id}`}
                              className="btn btn-secondary"
                              style={{ marginRight: 15 }}
                            >
                              Upravit
                            </Link>
                            {/* <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={this.showConfirmDeleteModal(source.id)}
                            >
                              Smazat
                            </button> */}
                          </div>

                          <h5 style={{ marginTop: 7 }}>{source.name}</h5>

                          <dl style={{ marginTop: 20 }}>
                            <dt className="text-muted">
                              <small>Odkaz</small>
                            </dt>
                            <dd>
                              {source.source_url ? (
                                <a href={source.source_url}>{this.getLink(source)}</a>
                              ) : (
                                'Nevyplněn'
                              )}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }}
          </GetSourcesQuery>
        </div>
      </React.Fragment>
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

export default connect(
  null,
  mapDispatchToProps,
)(Speakers);
