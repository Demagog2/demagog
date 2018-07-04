/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { Classes } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as classNames from 'classnames';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';

import { compact } from 'lodash';
import {
  GetSourcesQuery as GetSourcesQueryResult,
  GetSourcesQueryVariables,
} from '../operation-result-types';
import { GetSources } from '../queries/queries';
import Authorize from './Authorize';
import { SearchInput } from './forms/controls/SearchInput';
import Loading from './Loading';

import { displayDate } from '../utils';

class GetSourcesQuery extends Query<GetSourcesQueryResult, GetSourcesQueryVariables> {}

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
              Přidat zdroj výroků
            </Link>
          </div>
        </Authorize>

        <h2>Výroky</h2>

        <div style={{ marginTop: 15 }}>
          <SearchInput
            placeholder="Hledat dle názvu zdroje …"
            onChange={this.onSearchChange}
            value={this.state.search}
          />
        </div>

        <div style={{ marginTop: 15 }}>
          <GetSourcesQuery query={GetSources} variables={{ name: this.state.search }}>
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

              if (this.state.search !== '' && props.data.sources.length === 0) {
                return <p>Nenašli jsme žádný zdroj s názvem „{this.state.search}‟.</p>;
              }

              return (
                <table
                  className={classNames(Classes.HTML_TABLE, Classes.HTML_TABLE_STRIPED)}
                  style={{ width: '100%' }}
                >
                  <thead>
                    <tr>
                      <th scope="col" style={{ width: '60%' }}>
                        Zdroj
                      </th>
                      <th scope="col">Zveřejněné výroky</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    {props.data.sources.map((source) => (
                      <tr key={source.id}>
                        <td>
                          <div className={Classes.UI_TEXT_LARGE}>{source.name}</div>
                          <div className={Classes.TEXT_MUTED} style={{ marginTop: 5 }}>
                            {source.medium.name}, {displayDate(source.released_at)},{' '}
                            {source.media_personality.name}
                            {source.source_url && (
                              <>
                                , <a href={source.source_url}>odkaz</a>
                              </>
                            )}
                          </div>
                        </td>
                        <td>
                          <ul className={Classes.LIST_UNSTYLED} style={{ lineHeight: '1.5' }}>
                            {source.speakers_statements_stats.map((stat, index) => (
                              <li key={index}>
                                {stat.speaker.first_name} {stat.speaker.last_name}:{' '}
                                {stat.statements_published_count}
                              </li>
                            ))}
                          </ul>

                          {source.speakers_statements_stats.length === 0 && (
                            <span className={Classes.TEXT_MUTED}>Zatím žádné</span>
                          )}
                        </td>
                        <td>
                          <Link to={`/admin/sources/${source.id}`} className={Classes.BUTTON}>
                            Na detail zdroje
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            }}
          </GetSourcesQuery>
        </div>
      </div>
    );
  }
}

export default Sources;
