import * as React from 'react';

import { Mutation, Query } from '@apollo/client/react/components';
import { MutationFunction } from '@apollo/client';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

import { addFlashMessage } from '../../actions/flashMessages';
import { deleteArticleIllustration, uploadArticleIllustration } from '../../api';
import {
  ArticleInput,
  GetArticle as GetArticleQuery,
  GetArticleVariables as GetArticleQueryVariables,
  UpdateArticle as UpdateArticleMutation,
  UpdateArticleVariables as UpdateArticleMutationVariables,
} from '../../operation-result-types';
import { UpdateArticle } from '../../queries/mutations';
import { GetArticle, GetArticles } from '../../queries/queries';
import Loading from '../Loading';
import { ArticleSingleStatementForm } from './ArticleSingleStatementForm';

type UpdateArticleMutationFn = MutationFunction<
  UpdateArticleMutation,
  UpdateArticleMutationVariables
>;

interface IArticleSingleStatementEditProps
  extends RouteComponentProps<{ id: string }>,
    DispatchProp {}

class ArticleSingleStatementEdit extends React.Component<IArticleSingleStatementEditProps> {
  public onSuccess = () => {
    this.props.dispatch(addFlashMessage('Článek byl úspěšně uložen.', 'success'));
  };

  public onError = (error) => {
    this.props.dispatch(addFlashMessage('Došlo k chybě při ukládání článku', 'error'));
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  public onSubmit = (updateArticle: UpdateArticleMutationFn, oldArticle: GetArticleQuery) => (
    articleFormData: ArticleInput & { illustration: File },
  ) => {
    const { illustration, ...articleInput } = articleFormData;

    const id = this.getParamId();

    let imageUpload: Promise<any> = Promise.resolve();
    if (illustration instanceof File) {
      imageUpload = uploadArticleIllustration(id, illustration);
    } else if (illustration === null && oldArticle.article.illustration !== null) {
      imageUpload = deleteArticleIllustration(id);
    }

    return imageUpload
      .then(() => updateArticle({ variables: { id, articleInput } }))
      .then(() => this.onSuccess())
      .catch((error) => this.onError(error));
  };

  public getParamId = () => this.props.match.params.id;

  public render() {
    const id = this.getParamId();

    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <Query<GetArticleQuery, GetArticleQueryVariables> query={GetArticle} variables={{ id }}>
          {({ data, loading }) => {
            if (loading) {
              return <Loading />;
            }

            if (!data) {
              return null;
            }

            return (
              <Mutation<UpdateArticleMutation, UpdateArticleMutationVariables>
                mutation={UpdateArticle}
                refetchQueries={[
                  { query: GetArticles, variables: { name: null } },
                  { query: GetArticle, variables: { id } },
                ]}
              >
                {(updateArticle) => {
                  return (
                    <ArticleSingleStatementForm
                      article={data.article}
                      onSubmit={this.onSubmit(updateArticle, data)}
                      title="Upravit článek s jednotlivým výrokem"
                      backPath="/admin/articles"
                    />
                  );
                }}
              </Mutation>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default connect()(ArticleSingleStatementEdit);
