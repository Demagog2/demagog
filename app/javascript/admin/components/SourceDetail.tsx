/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { ApolloError } from 'apollo-client';
import * as classNames from 'classnames';
import { get, orderBy } from 'lodash';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import {
  ASSESSMENT_STATUS_APPROVAL_NEEDED,
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_BEING_EVALUATED,
} from '../constants';
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
import StatementCard from './StatementCard';

class GetSourceQueryComponent extends Query<GetSourceQuery> {}
class GetSourceStatementsQueryComponent extends Query<
  GetSourceStatementsQuery,
  GetSourceStatementsQueryVariables
> {}

const STATUS_FILTER_LABELS = {
  [ASSESSMENT_STATUS_BEING_EVALUATED]: 'Ve zpracování',
  [ASSESSMENT_STATUS_APPROVAL_NEEDED]: 'Ke kontrole',
  [ASSESSMENT_STATUS_APPROVED]: 'Schválené',
};

interface IProps extends RouteComponentProps<{ sourceId: string }> {
  addFlashMessage: (msg: string) => void;
}

interface IState {
  showAddStatementDropdown: boolean;
  showConfirmDeleteModal: boolean;
  statementsFilter: null | {
    field: string;
    value: any;
  };
}

class SourceDetail extends React.Component<IProps, IState> {
  public addStatementDropdown: HTMLElement | null = null;

  public state: IState = {
    showAddStatementDropdown: false,
    showConfirmDeleteModal: false,
    statementsFilter: null,
  };

  public componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  public componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

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

  public handleClickOutside = (event: MouseEvent) => {
    if (
      this.state.showAddStatementDropdown &&
      this.addStatementDropdown !== null &&
      !this.addStatementDropdown.contains(event.target as Node)
    ) {
      this.toggleAddStatementDropdown();
    }
  };

  public toggleAddStatementDropdown = () => {
    this.setState({ showAddStatementDropdown: !this.state.showAddStatementDropdown });
  };

  public onStatementsFilterClick = (field: string, value: any) => (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    this.setState({ statementsFilter: { field, value } });

    event.preventDefault();
    return false;
  };

  public onCancelStatementsFilterClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    this.setState({ statementsFilter: null });

    event.preventDefault();
    return false;
  };

  public render() {
    return (
      <GetSourceQueryComponent
        query={GetSource}
        variables={{ id: parseInt(this.props.match.params.sourceId, 10) }}
      >
        {({ data, loading, error }) => {
          if (error) {
            console.error(error); // tslint:disable-line:no-console
          }

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
    const { showAddStatementDropdown, statementsFilter } = this.state;

    return (
      <GetSourceStatementsQueryComponent
        query={GetSourceStatements}
        variables={{ sourceId: parseInt(source.id, 10) }}
      >
        {({ data, loading, error, refetch }) => {
          if (error) {
            console.error(error); // tslint:disable-line:no-console
          }

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
                    className="btn btn-secondary"
                  >
                    Přidat výrok ručně
                  </Link>
                </p>
              </div>
            );
          }

          const statusFilterOptions = Object.keys(STATUS_FILTER_LABELS).map((statusKey) => ({
            value: statusKey,
            label: STATUS_FILTER_LABELS[statusKey],
            count: data.statements.filter(
              (statement) => statement.assessment.evaluation_status === statusKey,
            ).length,
            active:
              statementsFilter !== null &&
              statementsFilter.field === 'assessment.evaluation_status' &&
              statementsFilter.value === statusKey,
          }));

          const publishedFilterOptions = [false, true].map((value) => ({
            value,
            label: value ? 'Zveřejněné' : 'Nezveřejněné',
            count: data.statements.filter((statement) => statement.published === value).length,
            active:
              statementsFilter !== null &&
              statementsFilter.field === 'published' &&
              statementsFilter.value === value,
          }));

          const evaluators = data.statements.reduce((carry, statement) => {
            if (statement.assessment.evaluator && !carry[statement.assessment.evaluator.id]) {
              carry[statement.assessment.evaluator.id] = statement.assessment.evaluator;
            }
            return carry;
          }, {});

          let evaluatorFilterOptions = Object.keys(evaluators).map((evaluatorId) => ({
            value: evaluatorId,
            label: `${evaluators[evaluatorId].first_name} ${evaluators[evaluatorId].last_name}`,
            count: data.statements.filter(
              (statement) =>
                statement.assessment.evaluator && statement.assessment.evaluator.id === evaluatorId,
            ).length,
            active:
              statementsFilter !== null &&
              statementsFilter.field === 'assessment.evaluator.id' &&
              statementsFilter.value === evaluatorId,
          }));

          evaluatorFilterOptions = orderBy(
            evaluatorFilterOptions,
            ['count', 'label'],
            ['desc', 'asc'],
          );

          const statementsToDisplay = data.statements.filter((statement) => {
            if (statementsFilter !== null) {
              return get(statement, statementsFilter.field) === statementsFilter.value;
            } else {
              return true;
            }
          });

          return (
            <>
              <div style={{ display: 'flex', marginTop: 30 }}>
                <div style={{ flex: '0 0 220px', marginRight: 15 }}>
                  <div
                    className={classNames('dropdown', { show: showAddStatementDropdown })}
                    ref={(ref) => (this.addStatementDropdown = ref)}
                  >
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      id="dropdownMenuButton"
                      onClick={this.toggleAddStatementDropdown}
                    >
                      Přidat výrok
                    </button>
                    <div
                      className={classNames('dropdown-menu', { show: showAddStatementDropdown })}
                    >
                      <Link
                        to={`/admin/sources/${source.id}/statements-from-transcript`}
                        className="dropdown-item"
                      >
                        Přidat výroky výběrem z přepisu
                      </Link>
                      <Link
                        to={`/admin/sources/${source.id}/statements/new`}
                        className="dropdown-item"
                      >
                        Přidat výrok ručně
                      </Link>
                    </div>
                  </div>
                </div>
                <div style={{ flex: '1 0' }}>
                  <div className="float-right">
                    <Link
                      to={`/admin/sources/${source.id}/statements-sort`}
                      className="btn btn-secondary"
                    >
                      Seřadit výroky
                    </Link>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', marginTop: 22, marginBottom: 50 }}>
                <div style={{ flex: '0 0 220px', marginRight: 15 }}>
                  <ul className="nav flex-column">
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        style={statementsFilter === null ? { fontWeight: 'bold' } : {}}
                        href=""
                        onClick={this.onCancelStatementsFilterClick}
                      >
                        Všechny výroky ({data.statements.length})
                      </a>
                    </li>
                  </ul>

                  <h6 style={{ marginTop: 15 }}>Filtrovat dle stavu</h6>

                  <ul className="nav flex-column">
                    {statusFilterOptions.map((option) => (
                      <li className="nav-item" key={option.value}>
                        <a
                          className="nav-link"
                          style={option.active ? { fontWeight: 'bold' } : {}}
                          href=""
                          onClick={this.onStatementsFilterClick(
                            'assessment.evaluation_status',
                            option.value,
                          )}
                        >
                          {option.label} ({option.count})
                        </a>
                      </li>
                    ))}
                  </ul>

                  <h6 style={{ marginTop: 15 }}>Filtrovat dle zveřejnění</h6>

                  <ul className="nav flex-column">
                    {publishedFilterOptions.map((option) => (
                      <li className="nav-item" key={String(option.value)}>
                        <a
                          className="nav-link"
                          style={option.active ? { fontWeight: 'bold' } : {}}
                          href=""
                          onClick={this.onStatementsFilterClick('published', option.value)}
                        >
                          {option.label} ({option.count})
                        </a>
                      </li>
                    ))}
                  </ul>

                  <h6 style={{ marginTop: 15 }}>Filtrovat dle ověřovatele</h6>

                  <ul className="nav flex-column">
                    {evaluatorFilterOptions.map((option) => (
                      <li className="nav-item" key={option.value}>
                        <a
                          className="nav-link"
                          style={option.active ? { fontWeight: 'bold' } : {}}
                          href=""
                          onClick={this.onStatementsFilterClick(
                            'assessment.evaluator.id',
                            option.value,
                          )}
                        >
                          {option.label} ({option.count})
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ flex: '1 0' }}>
                  {statementsToDisplay.map((statement) => (
                    <StatementCard
                      key={statement.id}
                      statement={statement}
                      onDeleted={() => {
                        refetch({ sourceId: parseInt(source.id, 10) });
                      }}
                    />
                  ))}
                  {statementsToDisplay.length === 0 && (
                    <p>Vybranému filtru nevyhovují žádné výroky</p>
                  )}
                </div>
              </div>
            </>
          );
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
