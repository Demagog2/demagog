/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import {
  Button,
  Classes,
  Colors,
  Dialog,
  Intent,
  Menu,
  MenuDivider,
  MenuItem,
  NonIdealState,
  Popover,
  Position,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as Sentry from '@sentry/browser';
import { ApolloError } from 'apollo-client';
import { css, cx } from 'emotion';
import { get, groupBy, orderBy } from 'lodash';
import { Mutation, Query } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import apolloClient from '../apolloClient';
import {
  ASSESSMENT_STATUS_APPROVAL_NEEDED,
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_BEING_EVALUATED,
  ASSESSMENT_STATUS_PROOFREADING_NEEDED,
} from '../constants';
import {
  GetSourceQuery,
  GetSourceStatementsQuery,
  GetSourceStatementsQueryVariables,
} from '../operation-result-types';
import { DeleteSource, PublishApprovedSourceStatements } from '../queries/mutations';
import { GetSource, GetSources, GetSourceStatements } from '../queries/queries';
import { displayDate } from '../utils';
import Authorize from './Authorize';
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
            <div style={{ padding: '15px 0 40px 0' }}>
              {this.state.showConfirmDeleteModal && (
                <ConfirmDeleteModal
                  message={`Opravdu chcete smazat diskuzi ${
                    source.name
                  } se všemi výroky, které k ní patří?`}
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

                    {/* <>
                      <Link
                        to={`/admin/sources/edit/${source.id}`}
                        className={Classes.BUTTON}
                        style={{ marginLeft: 7 }}
                      >
                        Upravit údaje o diskuzi
                      </Link>
                      <button
                        type="button"
                        className={Classes.BUTTON}
                        style={{ marginLeft: 7 }}
                        onClick={this.toggleConfirmDeleteModal}
                      >
                        Smazat diskuzi
                      </button>
                    </> */}
                  </Authorize>
                  <Link to="/admin/sources" className={Classes.BUTTON} style={{ marginLeft: 7 }}>
                    Zpět na seznam diskuzí
                  </Link>
                </div>

                <h2 className={Classes.HEADING}>{source.name}</h2>

                <span>
                  {source.medium.name} ze dne {displayDate(source.released_at)}
                  {source.media_personalities.length > 0 && (
                    <>, {source.media_personalities.map((p) => p.name).join(' & ')}</>
                  )}
                  {source.source_url && (
                    <>
                      , <a href={source.source_url}>odkaz</a>
                    </>
                  )}
                  {source.expert && (
                    <>
                      <br />
                      Expert: {source.expert.first_name} {source.expert.last_name}
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

  public renderStatements(source: GetSourceQuery['source']) {
    const { statementsFilter } = this.state;

    return (
      <GetSourceStatementsQueryComponent
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
                <NonIdealState title="Zatím tu nejsou žádné výroky">
                  <Link
                    to={`/admin/sources/${source.id}/statements-from-transcript`}
                    className={Classes.BUTTON}
                  >
                    Přidat výroky výběrem z přepisu
                  </Link>
                  <div style={{ margin: '5px 0' }}>nebo</div>
                  <Link
                    to={`/admin/sources/${source.id}/statements/new`}
                    className={Classes.BUTTON}
                  >
                    Přidat výrok ručně
                  </Link>
                </NonIdealState>
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

          type IEvaluatorFilterOptions = Array<{
            value: string | null;
            label: string;
            count: number;
            active: boolean;
          }>;

          let evaluatorFilterOptions: IEvaluatorFilterOptions = Object.keys(evaluators).map(
            (evaluatorId) => ({
              value: evaluatorId,
              label: `${evaluators[evaluatorId].first_name} ${evaluators[evaluatorId].last_name}`,
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

          const veracitiesBySpeaker = source.speakers.map((speaker) => {
            const speakerStatements = data.statements.filter(
              (statement) => statement.speaker.id === speaker.id,
            );
            const groupedByVeracity = groupBy(speakerStatements, (statement) => {
              switch (statement.assessment.evaluation_status) {
                case ASSESSMENT_STATUS_APPROVED:
                // When statement is already in proofreading state, the veracity won't
                // change, so we can already include it in the stats as well
                case ASSESSMENT_STATUS_PROOFREADING_NEEDED:
                  if (statement.assessment.veracity === null) {
                    // If the statement does not have veracity set in proofreading or approved
                    // state, don't fail and just log this to sentry
                    Sentry.withScope((scope) => {
                      scope.setLevel(Sentry.Severity.Warning);
                      scope.setExtra('apollo_cache', JSON.stringify(apolloClient.extract()));
                      Sentry.captureException(
                        `Expected non-null veracity for statement #${statement.id}`,
                      );
                    });
                    // tslint:disable-next-line:no-console
                    console.warn(`Expected non-null veracity for statement #${statement.id}`);

                    return 'being-evaluated';
                  }

                  return statement.assessment.veracity.key;

                default:
                  return 'being-evaluated';
              }
            });

            return {
              speaker,
              trueCount: get(groupedByVeracity, 'true.length', 0),
              untrueCount: get(groupedByVeracity, 'untrue.length', 0),
              misleadingCount: get(groupedByVeracity, 'misleading.length', 0),
              unverifiableCount: get(groupedByVeracity, 'unverifiable.length', 0),
              beingEvaluatedCount: get(groupedByVeracity, 'being-evaluated.length', 0),
            };
          });

          const statementsToDisplay = data.statements.filter((statement) => {
            if (statementsFilter !== null) {
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
                      <Authorize permissions={['statements:edit']}>
                        <Button onClick={this.toggleMassStatementsPublishModal}>
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
                          'assessment.evaluation_status',
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

                  <div
                    className={css`
                      background-color: ${Colors.LIGHT_GRAY5};
                      padding: 15px 15px 5px 15px;
                      margin-top: 20px;
                    `}
                  >
                    {veracitiesBySpeaker.map((stat) => (
                      <p key={stat.speaker.id}>
                        <strong>
                          {stat.speaker.first_name} {stat.speaker.last_name}
                        </strong>
                        <br />
                        {stat.trueCount} pravda<br />
                        {stat.untrueCount} nepravda<br />
                        {stat.misleadingCount} zavádějící<br />
                        {stat.unverifiableCount} neověřitelné<br />
                        {stat.beingEvaluatedCount} se ještě ověřuje
                      </p>
                    ))}
                  </div>
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
      </GetSourceStatementsQueryComponent>
    );
  }
}

interface IMassStatementsPublishModalProps {
  statements: GetSourceStatementsQuery['statements'];
  source: GetSourceQuery['source'];
  onCancel: () => any;
  onCompleted: () => any;
  onError: (error: ApolloError) => any;
}

class MassStatementsPublishModal extends React.Component<IMassStatementsPublishModalProps> {
  public render() {
    const { source, statements, onCancel, onCompleted, onError } = this.props;

    const approvedAndNotPublished = statements.filter(
      (s) => s.assessment.evaluation_status === ASSESSMENT_STATUS_APPROVED && !s.published,
    );

    return (
      <Dialog isOpen onClose={onCancel} title="Opravdu zveřejnit?">
        <div className={Classes.DIALOG_BODY}>
          {approvedAndNotPublished.length > 0 ? (
            <>
              Opravdu chceš zveřejnit všech {approvedAndNotPublished.length} schválených a
              nezveřejněných výroků v rámci této diskuze?
            </>
          ) : (
            <>V rámci diskuze teď nemáš žádné schválené a nezveřejněné výroky.</>
          )}
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button text="Zpět" onClick={onCancel} />
            {approvedAndNotPublished.length > 0 && (
              <Mutation mutation={PublishApprovedSourceStatements} variables={{ id: source.id }}>
                {(mutate, { loading }) => (
                  <Button
                    intent={Intent.PRIMARY}
                    onClick={() =>
                      mutate()
                        // Adding the onCompleted/onError callbacks here, because on Apollo's Mutation
                        // component they don't work in this setup for some reason :/
                        .then(onCompleted)
                        .catch(onError)
                    }
                    text={
                      loading
                        ? 'Zveřejňuju …'
                        : `Zveřejnit ${approvedAndNotPublished.length} výroků`
                    }
                    disabled={loading}
                  />
                )}
              </Mutation>
            )}
          </div>
        </div>
      </Dialog>
    );
  }
}

export default connect()(SourceDetail);
