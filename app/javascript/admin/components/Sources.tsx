/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { Button, Classes, NonIdealState } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as classNames from 'classnames';
import { compact } from 'lodash';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';

import {
  ASSESSMENT_STATUS_APPROVAL_NEEDED,
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_BEING_EVALUATED,
  ASSESSMENT_STATUS_PROOFREADING_NEEDED,
} from '../constants';
import {
  GetSources as GetSourcesQuery,
  GetSourcesVariables as GetSourcesQueryVariables,
} from '../operation-result-types';
import { GetSources } from '../queries/queries';
import { displayDate } from '../utils';
import Authorize from './Authorize';
import { SearchInput } from './forms/controls/SearchInput';
import Loading from './Loading';

interface IState {
  search: string;
  confirmDeleteModalSpeakerId: string | null;
}

class Sources extends React.Component<{}, IState> {
  public state = {
    search: '',
    confirmDeleteModalSpeakerId: null,
  };

  public getLink(source: any): string {
    return compact([
      source.medium ? source.medium.name : undefined,
      source.released_at,
      source.medium_personality ? source.medium_personality.name : undefined,
    ]).join(', ');
  }

  public onSearchChange = (search: string) => {
    this.setState({ search });
  };

  public render() {
    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <Authorize permissions={['sources:edit']}>
          <div style={{ float: 'right' }}>
            <Link
              className={classNames(
                Classes.BUTTON,
                Classes.INTENT_PRIMARY,
                Classes.iconClass(IconNames.PLUS),
              )}
              to="/admin/sources/new"
            >
              Přidat novou diskuzi
            </Link>
          </div>
        </Authorize>

        <h2 className={Classes.HEADING}>Výroky</h2>

        <div style={{ marginTop: 15 }}>
          <SearchInput
            placeholder="Hledat dle názvu diskuze…"
            onChange={this.onSearchChange}
            value={this.state.search}
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <Query<GetSourcesQuery, GetSourcesQueryVariables>
            query={GetSources}
            variables={{ name: this.state.search, offset: 0, limit: 50 }}
          >
            {(props) => {
              if (props.loading) {
                return <Loading />;
              }

              if (props.error) {
                return (
                  <NonIdealState
                    icon={IconNames.ERROR}
                    title="Došlo k chybě při načítání seznamu zdrojů"
                    description="Kontaktujte správce systému"
                  />
                );
              }

              if (!props.data) {
                return null;
              }

              if (this.state.search !== '' && props.data.sources.length === 0) {
                return <p>Nenašli jsme žádnou diskuzi s názvem „{this.state.search}“.</p>;
              }

              return (
                <React.Fragment>
                  <table
                    className={classNames(Classes.HTML_TABLE, Classes.HTML_TABLE_STRIPED)}
                    style={{ width: '100%' }}
                  >
                    <thead>
                      <tr>
                        <th scope="col" style={{ width: '50%' }}>
                          Diskuze
                        </th>
                        <th scope="col">Editoři</th>
                        <th scope="col">
                          Výroky
                          <br />
                          <small className={Classes.TEXT_MUTED}>
                            ve zpracování/ke kontrole/ke korektuře/schválené
                          </small>
                        </th>
                        <th scope="col" />
                      </tr>
                    </thead>
                    <tbody>
                      {props.data.sources.map((source) => {
                        const statementsCountsMap = source.statementsCountsByEvaluationStatus.reduce(
                          (carry, item) => {
                            return { ...carry, [item.evaluationStatus]: item.statementsCount };
                          },
                          {
                            [ASSESSMENT_STATUS_BEING_EVALUATED]: 0,
                            [ASSESSMENT_STATUS_APPROVAL_NEEDED]: 0,
                            [ASSESSMENT_STATUS_PROOFREADING_NEEDED]: 0,
                            [ASSESSMENT_STATUS_APPROVED]: 0,
                          },
                        );

                        return (
                          <tr key={source.id}>
                            <td>
                              <div className={Classes.TEXT_LARGE}>{source.name}</div>
                              <div className={Classes.TEXT_MUTED} style={{ marginTop: 5 }}>
                                {source.medium?.name} ze dne{' '}
                                {source.releasedAt ? displayDate(source.releasedAt) : 'neuvedeno'}
                                {source.mediaPersonalities?.length && (
                                  <>, {source.mediaPersonalities?.map((p) => p.name).join(' & ')}</>
                                )}
                                {source.sourceUrl && (
                                  <>
                                    , <a href={source.sourceUrl}>odkaz</a>
                                  </>
                                )}
                              </div>
                            </td>
                            <td>
                              {source.experts
                                ?.map((expert) => `${expert.firstName} ${expert.lastName}`)
                                .join(', ')}
                              {source.experts?.length === 0 && (
                                <span className={Classes.TEXT_MUTED}>Nepřiřazení</span>
                              )}
                            </td>
                            <td>
                              {Object.keys(statementsCountsMap).map(
                                (evaluationStatus, index, { length }) => (
                                  <React.Fragment key={evaluationStatus}>
                                    <span
                                      style={{
                                        fontWeight:
                                          statementsCountsMap[evaluationStatus] > 0
                                            ? 'bold'
                                            : 'normal',
                                      }}
                                    >
                                      {statementsCountsMap[evaluationStatus]}
                                    </span>

                                    {index < length - 1 && (
                                      <span className={Classes.TEXT_MUTED}> / </span>
                                    )}
                                  </React.Fragment>
                                ),
                              )}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <Link to={`/admin/sources/${source.id}`} className={Classes.BUTTON}>
                                Na detail diskuze
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <Button
                    style={{ marginTop: 10 }}
                    onClick={() =>
                      props.fetchMore({
                        variables: {
                          offset: props.data && props.data.sources.length,
                        },

                        updateQuery: (prev, { fetchMoreResult }) => {
                          if (!fetchMoreResult) {
                            return prev;
                          }

                          return {
                            ...prev,
                            sources: [...prev.sources, ...fetchMoreResult.sources],
                          };
                        },
                      })
                    }
                    text="Načíst další"
                  />
                </React.Fragment>
              );
            }}
          </Query>
        </div>
      </div>
    );
  }
}

export default Sources;
