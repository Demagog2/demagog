/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { Query } from 'react-apollo';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';

import {
  GetSourceQuery,
  GetSourceStatementsQuery,
  GetSourceStatementsQueryVariables,
} from '../operation-result-types';
import { GetSource, GetSourceStatements } from '../queries/queries';
import { displayDate } from '../utils';
import Loading from './Loading';

class GetSourceQueryComponent extends Query<GetSourceQuery> {}
class GetSourceStatementsQueryComponent extends Query<
  GetSourceStatementsQuery,
  GetSourceStatementsQueryVariables
> {}

interface IProps extends RouteComponentProps<{ sourceId: string }> {}

class Statements extends React.Component<IProps> {
  // tslint:disable-next-line:member-ordering
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
              <div>
                <div className="float-right" style={{ marginTop: 15 }}>
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
                    disabled
                    style={{ marginLeft: 7 }}
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
                    className="btn btn-secondary"
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

export default connect()(Statements);
