/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { ApolloError } from 'apollo-client';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import {
  GetSourceQuery,
  GetSourceStatementsQuery,
  GetSourceStatementsQueryVariables,
} from '../operation-result-types';
import { DeleteSource } from '../queries/mutations';
import { GetSource, GetSources, GetSourceStatements } from '../queries/queries';
import { displayDate } from '../utils';
import Loading from './Loading';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';

class GetSourceQueryComponent extends Query<GetSourceQuery> {}
class GetSourceStatementsQueryComponent extends Query<
  GetSourceStatementsQuery,
  GetSourceStatementsQueryVariables
> {}

interface IProps extends RouteComponentProps<{ sourceId: string }> {
  addFlashMessage: (msg: string) => void;
}

interface IState {
  showConfirmDeleteModal: boolean;
}

class SourceDetail extends React.Component<IProps, IState> {
  public state = {
    showConfirmDeleteModal: false,
  };

  public toggleConfirmDeleteModal = () => {
    this.setState({ showConfirmDeleteModal: !this.state.showConfirmDeleteModal });
  };

  public onDeleted = () => {
    this.props.addFlashMessage('Zdroj včetně jeho výroků byl úspěšně smazán.');
    this.props.history.push(`/admin/sources`);
  };

  public onDeleteError = (error: ApolloError) => {
    this.props.addFlashMessage('Doško k chybě při mazání zdroje');

    console.error(error); // tslint:disable-line:no-console
  };

  public render() {
    return (
      <GetSourceQueryComponent
        query={GetSource}
        variables={{ id: parseInt(this.props.match.params.sourceId, 10) }}
      >
        {({ data, loading }) => {
          if (loading) {
            return <Loading />;
          }

          if (!data) {
            return null;
          }

          const source = data.source;

          return (
            <div>
              {this.state.showConfirmDeleteModal && (
                <ConfirmDeleteModal
                  message={`Opravdu chcete smazat zdroj ${
                    source.name
                  } se všemi výroky, které k němu patří?`}
                  onCancel={this.toggleConfirmDeleteModal}
                  mutation={DeleteSource}
                  mutationProps={{
                    variables: { id: source.id },
                    refetchQueries: [
                      {
                        query: GetSource,
                        variables: { id: parseInt(source.id, 10) },
                      },
                      {
                        query: GetSources,
                        variables: { name: null },
                      },
                    ],
                    onCompleted: this.onDeleted,
                    onError: this.onDeleteError,
                  }}
                />
              )}

              <div>
                <div className="float-right">
                  <Link to="/admin/sources" className="btn btn-secondary">
                    Zpět
                  </Link>
                  <Link
                    to={`/admin/sources/edit/${source.id}`}
                    className="btn btn-secondary"
                    style={{ marginLeft: 7 }}
                  >
                    Upravit údaje o zdroji
                  </Link>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ marginLeft: 7 }}
                    onClick={this.toggleConfirmDeleteModal}
                  >
                    Smazat zdroj
                  </button>
                </div>

                <h3 style={{ marginTop: 7 }}>{source.name}</h3>

                <span>
                  {source.medium.name}, {displayDate(source.released_at)},{' '}
                  {source.media_personality.name}
                  {source.source_url && (
                    <>
                      , <a href={source.source_url}>odkaz</a>
                    </>
                  )}
                </span>
              </div>

              {this.renderStatements(source)}
            </div>
          );
        }}
      </GetSourceQueryComponent>
    );
  }

  public renderStatements(source) {
    return (
      <GetSourceStatementsQueryComponent
        query={GetSourceStatements}
        variables={{ sourceId: parseInt(source.id, 10) }}
      >
        {({ data, loading }) => {
          if (loading) {
            return <Loading />;
          }

          if (!data) {
            return null;
          }

          if (data.statements.length === 0) {
            return (
              <div>
                <p className="text-center mt-5">
                  Zatím tu nejsou žádné výroky<br />
                  <Link
                    to={`/admin/sources/${source.id}/statements-from-transcript`}
                    className="btn btn-secondary"
                  >
                    Přidat výroky výběrem z přepisu
                  </Link>
                  <br />
                  nebo<br />
                  <Link
                    to={`/admin/sources/${source.id}/statements/new`}
                    className="btn btn-secondary disabled"
                  >
                    Přidat výrok ručně
                  </Link>
                </p>
              </div>
            );
          }

          // TODO: pagination?
          return <div>{data.statements.length} vyroku</div>;
        }}
      </GetSourceStatementsQueryComponent>
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
)(SourceDetail);
