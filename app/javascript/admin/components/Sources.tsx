/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

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
  name: string | null;
  confirmDeleteModalSpeakerId: string | null;
}

class Sources extends React.Component<{}, IState> {
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

  // tslint:disable-next-line:member-ordering
  public render() {
    return (
      <React.Fragment>
        <div role="main" style={{ marginTop: 15 }}>
          <Authorize permissions={['sources:edit']}>
            <div className="float-right">
              <Link className="btn btn-primary" to="/admin/sources/new">
                Přidat zdroj výroků
              </Link>
            </div>
          </Authorize>

          <h3>Výroky</h3>

          <div style={{ marginTop: 25 }}>
            <SearchInput placeholder="Hledat dle názvu zdroje …" onChange={this.onSearchChange} />
          </div>

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

              return (
                <div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Zdroj</th>
                        <th scope="col">Zveřejněné výroky</th>
                        <th scope="col" />
                      </tr>
                    </thead>
                    <tbody>
                      {props.data.sources.map((source) => (
                        <tr key={source.id}>
                          <td>
                            {source.name}
                            <br />
                            <span className="text-muted small">
                              {source.medium.name}, {displayDate(source.released_at)},{' '}
                              {source.media_personality.name}
                              {source.source_url && (
                                <>
                                  , <a href={source.source_url}>odkaz</a>
                                </>
                              )}
                            </span>
                          </td>
                          <td>
                            {source.speakers_statements_stats.map((stat, index) => (
                              <span key={index}>
                                {stat.speaker.first_name} {stat.speaker.last_name}:{' '}
                                {stat.statements_published_count}
                                <br />
                              </span>
                            ))}

                            {source.speakers_statements_stats.length === 0 && (
                              <span className="text-muted">Zatím žádné</span>
                            )}
                          </td>
                          <td>
                            <Link
                              to={`/admin/sources/${source.id}`}
                              className="btn btn-secondary btn-sm"
                            >
                              Na detail zdroje
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }}
          </GetSourcesQuery>
        </div>
      </React.Fragment>
    );
  }
}

export default Sources;
