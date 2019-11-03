/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { Button, Classes, Icon, Intent, Tag } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { ApolloError } from 'apollo-client';
import * as classNames from 'classnames';
import { Query } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { Link } from 'react-router-dom';

import { addFlashMessage } from '../../actions/flashMessages';
import {
  GetArticles as GetArticlesQueryResult,
  GetArticlesVariables as GetArticlesQueryVariables,
} from '../../operation-result-types';
import { DeleteArticle } from '../../queries/mutations';
import { GetArticles } from '../../queries/queries';
import { displayDate, isSameOrAfterToday } from '../../utils';
import Authorize from '../Authorize';
import { SearchInput } from '../forms/controls/SearchInput';
import Loading from '../Loading';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal';

const ARTICLES_PER_PAGE = 50;

const ARTICLE_TYPE_INTENT = {
  default: Intent.PRIMARY,
  static: Intent.WARNING,
};

const ARTICLE_TYPE_LABEL = {
  default: 'Ověřeno',
  static: 'Komentář',
};

interface IProps extends DispatchProp<any> {}

interface IState {
  search: string;
  confirmDeleteModalArticleId: string | null;
}

class Articles extends React.Component<IProps, IState> {
  public state = {
    search: '',
    confirmDeleteModalArticleId: null,
  };

  private onSearchChange = (search: string) => {
    this.setState({ search });
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
      <div style={{ padding: '15px 0 40px 0' }}>
        <Authorize permissions={['articles:edit']}>
          <div style={{ float: 'right' }}>
            <Link
              className={classNames(
                Classes.BUTTON,
                Classes.INTENT_PRIMARY,
                Classes.iconClass(IconNames.PLUS),
              )}
              to="/admin/articles/new"
            >
              Přidat článek
            </Link>
          </div>
        </Authorize>

        <h2 className={Classes.HEADING}>Články</h2>

        <div style={{ marginTop: 15 }}>
          <SearchInput
            placeholder="Hledat dle titulku…"
            onChange={this.onSearchChange}
            value={this.state.search}
          />
        </div>

        <Query<GetArticlesQueryResult, GetArticlesQueryVariables>
          query={GetArticles}
          variables={{ title: this.state.search, limit: ARTICLES_PER_PAGE, offset: 0 }}
        >
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

            const articlesLength = props.data.articles.length;

            return (
              <div style={{ marginTop: 15 }}>
                {confirmDeleteModalArticle && (
                  <ConfirmDeleteModal
                    message={`Opravdu chcete smazat článek „${confirmDeleteModalArticle.title}“?`}
                    onCancel={this.hideConfirmDeleteModal}
                    mutation={DeleteArticle}
                    mutationProps={{
                      variables: { id: confirmDeleteModalArticleId },
                      refetchQueries: [
                        {
                          query: GetArticles,
                          variables: {
                            title: this.state.search,
                            limit: ARTICLES_PER_PAGE,
                            offset: 0,
                          },
                        },
                      ],
                      onCompleted: this.onDeleted,
                      onError: this.onDeleteError,
                    }}
                  />
                )}

                {articlesLength > 0 && (
                  <React.Fragment>
                    <table
                      className={classNames(Classes.HTML_TABLE, Classes.HTML_TABLE_STRIPED)}
                      style={{ width: '100%' }}
                    >
                      <thead>
                        <tr>
                          <th scope="col">Titulek</th>
                          <th scope="col">Typ článku</th>
                          <th scope="col">Stav</th>
                          <th scope="col" />
                          <th scope="col" />
                        </tr>
                      </thead>
                      <tbody>
                        {props.data.articles.map((article) => (
                          <tr key={article.id}>
                            <td>{article.title}</td>
                            <td>
                              <Tag intent={ARTICLE_TYPE_INTENT[article.articleType]}>
                                {ARTICLE_TYPE_LABEL[article.articleType]}
                              </Tag>
                            </td>
                            <td>
                              {article.published &&
                                article.publishedAt &&
                                isSameOrAfterToday(article.publishedAt) && (
                                  <>Zveřejněný od {displayDate(article.publishedAt)}</>
                                )}
                              {article.published &&
                                article.publishedAt &&
                                !isSameOrAfterToday(article.publishedAt) && (
                                  <>
                                    <Icon icon={IconNames.TIME} /> Bude zveřejněný{' '}
                                    {displayDate(article.publishedAt)}
                                  </>
                                )}
                              {!article.published && (
                                <span className={Classes.TEXT_MUTED}>Nezveřejněný</span>
                              )}
                            </td>
                            <td>
                              {article.published &&
                                article.publishedAt &&
                                isSameOrAfterToday(article.publishedAt) && (
                                  <a href={`/diskuze/${article.slug}`} target="_blank">
                                    Veřejný odkaz
                                  </a>
                                )}
                            </td>
                            <td>
                              <div style={{ display: 'flex' }}>
                                <Link
                                  to={`/admin/articles/edit/${article.id}`}
                                  className={classNames(
                                    Classes.BUTTON,
                                    Classes.iconClass(IconNames.EDIT),
                                  )}
                                >
                                  Upravit
                                </Link>
                                <Button
                                  icon={IconNames.TRASH}
                                  style={{ marginLeft: 7 }}
                                  onClick={this.showConfirmDeleteModal(article.id)}
                                  title="Smazat"
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <Button
                      onClick={() =>
                        props.fetchMore({
                          variables: {
                            offset: articlesLength,
                          },

                          updateQuery: (prev, { fetchMoreResult }) => {
                            if (!fetchMoreResult) {
                              return prev;
                            }

                            return {
                              ...prev,
                              articles: [...prev.articles, ...fetchMoreResult.articles],
                            };
                          },
                        })
                      }
                      text="Načíst další"
                    />
                  </React.Fragment>
                )}

                {articlesLength === 0 && this.state.search !== '' && (
                  <p>Nenašli jsme žádný článek s názvem „{this.state.search}“.</p>
                )}
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default connect()(Articles);
