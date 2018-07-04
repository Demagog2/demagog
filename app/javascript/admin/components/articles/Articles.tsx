/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { ApolloError } from 'apollo-client';
import { Query } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { addFlashMessage } from '../../actions/flashMessages';
import {
  GetArticlesQuery as GetArticlesQueryResult,
  GetArticlesQueryVariables,
} from '../../operation-result-types';
import { DeleteArticle } from '../../queries/mutations';
import { GetArticles } from '../../queries/queries';
import { formatDate } from '../../utils/date';
import Authorize from '../Authorize';
import { SearchInput } from '../forms/controls/SearchInput';
import Loading from '../Loading';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';

class GetArticlesQuery extends Query<GetArticlesQueryResult, GetArticlesQueryVariables> {}

interface IProps {
  dispatch: Dispatch;
}

interface IState {
  name: string;
  confirmDeleteModalArticleId: string | null;
}

class Articles extends React.Component<IProps, IState> {
  public state = {
    name: '',
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
    this.props.dispatch(addFlashMessage('Článek byl úspěšně smazán.', 'success'));
    this.hideConfirmDeleteModal();
  };

  private onDeleteError = (error: ApolloError) => {
    this.props.dispatch(addFlashMessage('Doško k chybě při mazání článku.', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  // tslint:disable-next-line:member-ordering
  public render() {
    const { confirmDeleteModalArticleId } = this.state;

    return (
      <React.Fragment>
        <div>
          <Authorize permissions={['articles:edit']}>
            <div className="float-right">
              <Link className="btn btn-primary" to="/admin/articles/new">
                Přidat článek
              </Link>
            </div>
          </Authorize>

          <h3 style={{ marginTop: 7, marginBottom: 20 }}>Články</h3>

          <SearchInput
            placeholder="Vyhledat článek"
            onChange={this.onSearchChange}
            value={this.state.name}
          />

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

                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">Titulek</th>
                        <th scope="col">Zveřejněný</th>
                        <th scope="col" />
                      </tr>
                    </thead>
                    <tbody>
                      {props.data.articles.map((article) => (
                        <tr key={article.id}>
                          <td>{article.title}</td>
                          <td>
                            {article.published ? 'Ano' : 'Ne'}&nbsp;
                            {article.published_at && formatDate(article.published_at)}&nbsp;
                            <a href={`/diskuze/${article.slug}`}>Odkaz</a>
                          </td>
                          <td>
                            <Link
                              to={`/admin/articles/edit/${article.id}`}
                              className="btn btn-secondary btn-sm"
                              style={{ marginRight: 15 }}
                            >
                              Upravit
                            </Link>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={this.showConfirmDeleteModal(article.id)}
                            >
                              Smazat
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }}
          </GetArticlesQuery>
        </div>
      </React.Fragment>
    );
  }
}

export default connect()(Articles);
