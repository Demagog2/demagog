/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { ApolloError } from 'apollo-client';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { addFlashMessage } from '../../actions/flashMessages';
import {
  GetArticlesQuery as GetArticlesQueryResult,
  GetArticlesQueryVariables,
} from '../../operation-result-types';
import { DeleteArticle } from '../../queries/mutations';
import { GetArticles } from '../../queries/queries';
import { formatDate } from '../../utils/date';
import { SearchInput } from '../forms/controls/SearchInput';
import Loading from '../Loading';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';

class GetArticlesQuery extends Query<GetArticlesQueryResult, GetArticlesQueryVariables> {}

interface IProps {
  addFlashMessage: (msg: string) => void;
}

interface IState {
  name: string | null;
  confirmDeleteModalArticleId: string | null;
}

class Articles extends React.Component<IProps, IState> {
  public state = {
    name: null,
    confirmDeleteModalArticleId: null,
  };

  private onSearchChange = (name: string) => {
    this.setState({ name });
  };

  private showConfirmDeleteModal = (confirmDeleteModalArticleId: string) => () => {
    this.setState({ confirmDeleteModalArticleId });
  };

  private hideConfirmDeleteModal = () => {
    this.setState({ confirmDeleteModalArticleId: null });
  };

  private onDeleted = () => {
    this.props.addFlashMessage('Článek byl úspěšně smazán.');
    this.hideConfirmDeleteModal();
  };

  private onDeleteError = (error: ApolloError) => {
    this.props.addFlashMessage('Doško k chybě při mazání článku.');

    console.error(error); // tslint:disable-line:no-console
  };

  // tslint:disable-next-line:member-ordering
  public render() {
    const { confirmDeleteModalArticleId } = this.state;

    return (
      <React.Fragment>
        <div>
          <h1>Články</h1>

          <Link style={{ marginBottom: 20 }} className="btn btn-primary" to="/admin/articles/new">
            Přidat článek
          </Link>

          <SearchInput placeholder="Vyhledat článek" onChange={this.onSearchChange} />

          <GetArticlesQuery query={GetArticles} variables={{ title: this.state.name }}>
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

              const confirmDeleteModalArticle = props.data.articles.find(
                (s) => s.id === confirmDeleteModalArticleId,
              );

              return (
                <div>
                  {confirmDeleteModalArticle && (
                    <ConfirmDeleteModal
                      message={`Opravdu chcete smazat článek ${confirmDeleteModalArticle.title}?`}
                      onCancel={this.hideConfirmDeleteModal}
                      mutation={DeleteArticle}
                      mutationProps={{
                        variables: { id: confirmDeleteModalArticleId },
                        refetchQueries: [
                          { query: GetArticles, variables: { title: this.state.name } },
                        ],
                        onCompleted: this.onDeleted,
                        onError: this.onDeleteError,
                      }}
                    />
                  )}

                  {props.data.articles.map((article) => (
                    <div className="card" key={article.id} style={{ marginBottom: '1rem' }}>
                      <div className="card-body" style={{ display: 'flex' }}>
                        <div style={{ marginLeft: 15, flex: '1 0' }}>
                          <div style={{ float: 'right' }}>
                            <Link
                              to={`/admin/articles/edit/${article.id}`}
                              className="btn btn-secondary"
                              style={{ marginRight: 15 }}
                            >
                              Upravit
                            </Link>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={this.showConfirmDeleteModal(article.id)}
                            >
                              Smazat
                            </button>
                          </div>

                          <h5 style={{ marginTop: 7 }}>{article.title}</h5>

                          <dl style={{ marginTop: 20 }}>
                            <dt className="text-muted">
                              <small>Zveřejněný</small>
                            </dt>
                            <dd>
                              {article.published ? 'Ano' : 'Ne'}&nbsp;
                              {article.published_at && formatDate(article.published_at)}&nbsp;
                              <a href={`/diskuze/${article.slug}`}>Odkaz</a>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }}
          </GetArticlesQuery>
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
)(Articles);
