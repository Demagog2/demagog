import * as React from 'react';

import { Button, Classes, Icon, Intent, Tag } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import type { ApolloError } from 'apollo-client';
import { css, cx } from 'emotion';
import { Query } from 'react-apollo';
import type { DispatchProp } from 'react-redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { addFlashMessage } from '../../actions/flashMessages';
import type {
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
  single_statement: Intent.PRIMARY,
  facebook_factcheck: Intent.PRIMARY,
};

const ARTICLE_TYPE_LABEL = {
  default: 'Ověřeno',
  static: 'Komentář',
  single_statement: 'Jednotlivý výrok',
  facebook_factcheck: 'Facebook factcheck',
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

  private readonly onSearchChange = (search: string) => {
    this.setState({ search });
  };

  private readonly showConfirmDeleteModal = (confirmDeleteModalArticleId: string) => () => {
    this.setState({ confirmDeleteModalArticleId });
  };

  private readonly hideConfirmDeleteModal = () => {
    this.setState({ confirmDeleteModalArticleId: null });
  };

  private readonly onDeleted = () => {
    this.props.dispatch(addFlashMessage('Článek byl úspěšně smazán.', 'success'));
    this.hideConfirmDeleteModal();
  };

  private readonly onDeleteError = (error: ApolloError) => {
    this.props.dispatch(addFlashMessage('Doško k chybě při mazání článku.', 'error'));

    console.error(error);
  };

  public render() {
    const { confirmDeleteModalArticleId } = this.state;

    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <Authorize permissions={['articles:edit']}>
          <div style={{ float: 'right' }}>
            <Link
              className={cx(
                Classes.BUTTON,
                Classes.INTENT_PRIMARY,
                Classes.iconClass(IconNames.PLUS),
              )}
              to="/admin/articles/new-single-statement"
            >
              Přidat jednotlivý výrok
            </Link>
            <Link
              className={cx(
                Classes.BUTTON,
                Classes.INTENT_PRIMARY,
                Classes.iconClass(IconNames.PLUS),
                css`
                  margin-left: 10px;
                `,
              )}
              to="/admin/articles/new"
            >
              Přidat komentář/ověřeno/facebook factcheck
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
                      className={cx(Classes.HTML_TABLE, Classes.HTML_TABLE_STRIPED)}
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
                                  <a
                                    href={`/diskuze/${article.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    Veřejný odkaz
                                  </a>
                              )}
                            </td>
                            <td>
                              <div style={{ display: 'flex' }}>
                                <Link
                                  to={
                                    article.articleType === 'single_statement'
                                      ? `/admin/articles/edit-single-statement/${article.id}`
                                      : `/admin/articles/edit/${article.id}`
                                  }
                                  className={cx(Classes.BUTTON, Classes.iconClass(IconNames.EDIT))}
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
                      onClick={async() =>
                        await props.fetchMore({
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
