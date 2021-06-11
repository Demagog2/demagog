/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { Button, Classes, Menu, MenuDivider, MenuItem, Popover, Position } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { ApolloError } from 'apollo-client';
import { cx } from 'emotion';
import { get, orderBy } from 'lodash';
import * as queryString from 'query-string';
import { Query } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';

import { addFlashMessage } from '../../actions/flashMessages';
import {
  ASSESSMENT_STATUS_APPROVAL_NEEDED,
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_BEING_EVALUATED,
  ASSESSMENT_STATUS_PROOFREADING_NEEDED,
} from '../../constants';
import {
  GetSource as GetSourceQuery,
  GetSourceStatements as GetSourceStatementsQuery,
  GetSourceStatementsVariables as GetSourceStatementsQueryVariables,
} from '../../operation-result-types';
import { DeleteSource } from '../../queries/mutations';
import { GetSource, GetSources, GetSourceStatements } from '../../queries/queries';
import { displayDate } from '../../utils';
import Authorize from '../Authorize';
import Loading from '../Loading';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';
import StatementCard from '../StatementCard';
import { EmptySourceDetail } from './EmptySourceDetail';
import { SpeakersStats } from './SpeakersStats';
import { MassStatementsPublishModal } from './MassStatementsPublishModal';
import { SpeakerStatsContainer } from './SpeakerStatsContainer';

const STATUS_FILTER_LABELS = {
  [ASSESSMENT_STATUS_BEING_EVALUATED]: 'Ve zpracování',
  [ASSESSMENT_STATUS_APPROVAL_NEEDED]: 'Ke kontrole',
  [ASSESSMENT_STATUS_PROOFREADING_NEEDED]: 'Ke korektuře',
  [ASSESSMENT_STATUS_APPROVED]: 'Schválené',
};

interface IProps extends RouteComponentProps<{ sourceId: string }>, DispatchProp {}

interface IState {
  showConfirmDeleteModal: boolean;
  showMassStatementsPublishModal: boolean;
  statementsFilter: null | {
    field: string;
    value: any;
  };
}

class SourceDetail extends React.Component<IProps, IState> {
  public state: IState = {
    showConfirmDeleteModal: false,
    showMassStatementsPublishModal: false,
    statementsFilter: null,
  };
  private removeHistoryListener: null | (() => void);

  public componentDidMount() {
    this.removeHistoryListener = this.props.history.listen((location) => {
      this.updateStatementsFilterFromLocation(location);
    });
    this.updateStatementsFilterFromLocation(this.props.history.location);
  }

  public componentWillUnmount() {
    if (this.removeHistoryListener !== null) {
      this.removeHistoryListener();
      this.removeHistoryListener = null;
    }
  }

  public updateStatementsFilterFromLocation(location) {
    if (!location.search) {
      this.setState({ statementsFilter: null });
      return;
    }

    const queryParams = queryString.parse(location.search);
    if (!queryParams.filter) {
      return;
    }

    let filter;
    try {
      filter = JSON.parse(queryParams.filter as string);
    } catch (e) {
      return;
    }

    if (filter.field !== undefined && filter.value !== undefined) {
      this.setState({ statementsFilter: { field: filter.field, value: filter.value } });
    }
  }

  public toggleConfirmDeleteModal = () => {
    this.setState({ showConfirmDeleteModal: !this.state.showConfirmDeleteModal });
  };

  public toggleMassStatementsPublishModal = () => {
    this.setState({ showMassStatementsPublishModal: !this.state.showMassStatementsPublishModal });
  };

  public onDeleted = () => {
    this.props.dispatch(
      addFlashMessage('Diskuze včetně jejích výroků byla úspěšně smazána.', 'success'),
    );
    this.props.history.push(`/admin/sources`);
  };

  public onDeleteError = (error: ApolloError) => {
    this.props.dispatch(addFlashMessage('Doško k chybě při mazání diskuze', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  public onMassStatementsPublishCompleted = () => {
    this.props.dispatch(
      addFlashMessage(
        'Úspěšně zveřejněny všechny schválené a dosud nezveřejněné výroky.',
        'success',
      ),
    );

    this.setState({
      showMassStatementsPublishModal: false,
    });
  };

  public onMassStatementsPublishError = (error: ApolloError) => {
    this.props.dispatch(addFlashMessage('Doško k chybě při zveřejňování výroků', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  public onStatementsFilterClick = (field: string, value: any) => (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    const statementsFilter = { field, value };

    this.setState({ statementsFilter }, () => {
      // Make sure we update the url after the state is changed
      // so the location change listener can detect that the state
      // is already set
      this.props.history.push(
        this.props.history.location.pathname +
          '?filter=' +
          encodeURIComponent(JSON.stringify(statementsFilter)),
      );
    });

    event.preventDefault();
    return false;
  };

  public onCancelStatementsFilterClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    this.setState({ statementsFilter: null }, () => {
      // Reset the search part of location
      this.props.history.push(this.props.history.location.pathname);
    });

    event.preventDefault();
    return false;
  };

  public render() {
    return (
      <Query<GetSourceQuery>
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
            <div style={{ padding: '15px 0 40px 0' }}>
              {this.state.showConfirmDeleteModal && (
                <ConfirmDeleteModal
                  message={`Opravdu chcete smazat diskuzi ${source.name} se všemi výroky, které k ní patří?`}
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
                <div style={{ float: 'right' }}>
                  <Authorize permissions={['sources:edit']}>
                    <Popover
                      content={
                        <Menu>
                          <Link
                            to={`/admin/sources/edit/${source.id}`}
                            className={cx(Classes.MENU_ITEM, Classes.iconClass(IconNames.EDIT))}
                          >
                            Upravit údaje
                          </Link>
                          <button
                            type="button"
                            className={cx(
                              Classes.MENU_ITEM,
                              Classes.INTENT_DANGER,
                              Classes.iconClass(IconNames.TRASH),
                            )}
                            onClick={this.toggleConfirmDeleteModal}
                          >
                            Smazat…
                          </button>
                        </Menu>
                      }
                      minimal
                      position={Position.BOTTOM_LEFT}
                    >
                      <Button text="Diskuzi…" />
                    </Popover>
                  </Authorize>
                  <Link to="/admin/sources" className={Classes.BUTTON} style={{ marginLeft: 7 }}>
                    Zpět na seznam diskuzí
                  </Link>
                </div>

                <h2 className={Classes.HEADING}>{source.name}</h2>

                <span>
                  {source.medium?.name} ze dne{' '}
                  {source.releasedAt ? displayDate(source.releasedAt) : 'neuvedeno'}
                  {source.mediaPersonalities && source.mediaPersonalities.length > 0 && (
                    <>, {source.mediaPersonalities.map((p) => p.name).join(' & ')}</>
                  )}
                  {source.sourceUrl && (
                    <>
                      , <a href={source.sourceUrl}>odkaz</a>
                    </>
                  )}
                  {source.experts && source.experts.length > 0 && (
                    <>
                      <br />
                      {source.experts.length === 1 ? 'Editor: ' : 'Editoři: '}
                      {source.experts
                        .map((expert) => `${expert.firstName} ${expert.lastName}`)
                        .join(', ')}
                    </>
                  )}
                </span>
              </div>

              {this.renderStatements(source)}
            </div>
          );
        }}
      </Query>
    );
  }

  public renderStatements(source: GetSourceQuery['source']) {
    const { statementsFilter } = this.state;

    return (
      <Query<GetSourceStatementsQuery, GetSourceStatementsQueryVariables>
        query={GetSourceStatements}
        variables={{ sourceId: parseInt(source.id, 10), includeUnpublished: true }}
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

          if (data.statements.length === 0) {
            return (
              <div style={{ marginTop: 50 }}>
                <EmptySourceDetail source={source} />
              </div>
            );
          }

          const statusFilterOptions = Object.keys(STATUS_FILTER_LABELS).map((statusKey) => ({
            value: statusKey,
            label: STATUS_FILTER_LABELS[statusKey],
            count: data.statements.filter(
              (statement) => statement.assessment.evaluationStatus === statusKey,
            ).length,
            active:
              statementsFilter !== null &&
              statementsFilter.field === 'assessment.evaluationStatus' &&
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

          type IEvaluatorFilterOptions = Array<{
            value: string | null;
            label: string;
            count: number;
            active: boolean;
          }>;

          let evaluatorFilterOptions: IEvaluatorFilterOptions = Object.keys(evaluators).map(
            (evaluatorId) => ({
              value: evaluatorId,
              label: `${evaluators[evaluatorId].firstName} ${evaluators[evaluatorId].lastName}`,
              count: data.statements.filter(
                (statement) =>
                  statement.assessment.evaluator &&
                  statement.assessment.evaluator.id === evaluatorId,
              ).length,
              active:
                statementsFilter !== null &&
                statementsFilter.field === 'assessment.evaluator.id' &&
                statementsFilter.value === evaluatorId,
            }),
          );

          evaluatorFilterOptions = orderBy(
            evaluatorFilterOptions,
            ['count', 'label'],
            ['desc', 'asc'],
          );

          const statementsWithoutEvaluator = data.statements.filter(
            (statement) => !statement.assessment.evaluator,
          );
          if (statementsWithoutEvaluator.length > 0) {
            evaluatorFilterOptions.unshift({
              value: null,
              label: 'Nepřiřazené',
              count: statementsWithoutEvaluator.length,
              active:
                statementsFilter !== null &&
                statementsFilter.field === 'assessment.evaluator.id' &&
                statementsFilter.value === null,
            });
          }

          const statementsToDisplay = data.statements.filter((statement) => {
            if (statementsFilter !== null) {
              if (statementsFilter.field === 'verifiedAndUnpublished') {
                return (
                  statement.assessment.evaluationStatus === ASSESSMENT_STATUS_APPROVED &&
                  statement.published === false
                );
              }

              return get(statement, statementsFilter.field, null) === statementsFilter.value;
            } else {
              return true;
            }
          });

          return (
            <>
              {this.state.showMassStatementsPublishModal && (
                <MassStatementsPublishModal
                  source={source}
                  statements={data.statements}
                  onCancel={this.toggleMassStatementsPublishModal}
                  onCompleted={this.onMassStatementsPublishCompleted}
                  onError={this.onMassStatementsPublishError}
                />
              )}

              <Authorize permissions={['statements:add', 'statements:sort']}>
                <div style={{ display: 'flex', marginTop: 30 }}>
                  <div style={{ flex: '0 0 220px', marginRight: 15 }}>
                    <Authorize permissions={['statements:add']}>
                      <Popover
                        content={
                          <Menu>
                            <Link
                              to={`/admin/sources/${source.id}/statements-from-transcript`}
                              className={Classes.MENU_ITEM}
                            >
                              Přidat výroky výběrem z přepisu
                            </Link>
                            <Link
                              to={`/admin/sources/${source.id}/statements/new`}
                              className={Classes.MENU_ITEM}
                            >
                              Přidat výrok ručně
                            </Link>
                          </Menu>
                        }
                        minimal
                        position={Position.BOTTOM_LEFT}
                      >
                        <Button icon={IconNames.PLUS} text="Přidat výrok…" />
                      </Popover>
                    </Authorize>
                  </div>
                  <div style={{ flex: '1 1' }}>
                    <div style={{ float: 'right' }}>
                      <Link to={`/admin/sources/${source.id}/stats`} className={Classes.BUTTON}>
                        Statistiky
                      </Link>
                      <Authorize permissions={['statements:edit']}>
                        <Link
                          to={`/admin/sources/${source.id}/statements-video-marks`}
                          className={Classes.BUTTON}
                          style={{ marginLeft: 7 }}
                        >
                          Propojení s videozáznamem
                        </Link>
                        <Button
                          style={{ marginLeft: 7 }}
                          onClick={this.toggleMassStatementsPublishModal}
                        >
                          Zveřejnit všechny schválené výroky…
                        </Button>
                      </Authorize>
                      <Authorize permissions={['statements:sort']}>
                        <Link
                          to={`/admin/sources/${source.id}/statements-sort`}
                          className={Classes.BUTTON}
                          style={{ marginLeft: 7 }}
                        >
                          Seřadit výroky
                        </Link>
                      </Authorize>
                    </div>
                  </div>
                </div>
              </Authorize>

              <div style={{ display: 'flex', marginTop: 22, marginBottom: 50 }}>
                <div style={{ flex: '0 0 220px', marginRight: 15 }}>
                  <div className={Classes.LIST_UNSTYLED}>
                    <MenuItem
                      active={statementsFilter === null}
                      text={`Všechny výroky (${data.statements.length})`}
                      onClick={this.onCancelStatementsFilterClick}
                    />

                    <MenuDivider title="Filtrovat dle stavu" />
                    {statusFilterOptions.map((option) => (
                      <MenuItem
                        key={option.value}
                        active={option.active}
                        text={`${option.label} (${option.count})`}
                        onClick={this.onStatementsFilterClick(
                          'assessment.evaluationStatus',
                          option.value,
                        )}
                      />
                    ))}

                    <MenuDivider title="Filtrovat dle zveřejnění" />
                    {publishedFilterOptions.map((option) => (
                      <MenuItem
                        key={String(option.value)}
                        active={option.active}
                        text={`${option.label} (${option.count})`}
                        onClick={this.onStatementsFilterClick('published', option.value)}
                      />
                    ))}

                    <MenuItem
                      text={`Nezveřejněné, schválené (${
                        data.statements.filter(
                          (statement) =>
                            statement.assessment.evaluationStatus === ASSESSMENT_STATUS_APPROVED &&
                            statement.published === false,
                        ).length
                      })`}
                      active={
                        statementsFilter !== null &&
                        statementsFilter.field === 'verifiedAndUnpublished' &&
                        statementsFilter.value === true
                      }
                      onClick={this.onStatementsFilterClick('verifiedAndUnpublished', true)}
                    />

                    <MenuDivider title="Filtrovat dle ověřovatele" />
                    {evaluatorFilterOptions.map((option) => (
                      <MenuItem
                        key={option.value !== null ? option.value : 'null'}
                        active={option.active}
                        text={`${option.label} (${option.count})`}
                        onClick={this.onStatementsFilterClick(
                          'assessment.evaluator.id',
                          option.value,
                        )}
                      />
                    ))}
                  </div>

                  <SpeakersStats speakers={source.speakers ?? []} statements={data.statements} />

                  <SpeakerStatsContainer
                    speakers={source.speakers ?? []}
                    statements={data.statements}
                  />
                </div>
                <div style={{ flex: '1 1' }}>
                  {statementsToDisplay.map((statement) => (
                    <StatementCard
                      key={statement.id}
                      statement={statement}
                      refetchQueriesAfterDelete={[
                        {
                          query: GetSource,
                          variables: { id: parseInt(this.props.match.params.sourceId, 10) },
                        },
                        {
                          query: GetSourceStatements,
                          variables: {
                            sourceId: parseInt(source.id, 10),
                            includeUnpublished: true,
                          },
                        },
                      ]}
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
      </Query>
    );
  }
}

export default connect()(SourceDetail);
