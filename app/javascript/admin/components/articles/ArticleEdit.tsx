import * as React from 'react';

import { Mutation, Query, MutationFunction } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

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
import { ArticleForm } from './ArticleForm';

type UpdateArticleMutationFn = MutationFunction<
  UpdateArticleMutation,
  UpdateArticleMutationVariables
>;

export function ArticleEdit() {
  const dispatch = useDispatch();
  const params = useParams();

  const onSuccess = () => {
    dispatch(addFlashMessage('Článek byl úspěšně uložen.', 'success'));
  };

  const onError = (error) => {
    dispatch(addFlashMessage('Došlo k chybě při ukládání článku', 'error'));
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  const onSubmit = (updateArticle: UpdateArticleMutationFn, oldArticle: GetArticleQuery) => (
    articleFormData: ArticleInput & { illustration: File },
  ) => {
    const { illustration, ...articleInput } = articleFormData;

    const id = params.id ?? '';

    let imageUpload: Promise<any> = Promise.resolve();
    if (illustration instanceof File) {
      imageUpload = uploadArticleIllustration(id, illustration);
    } else if (illustration === null && oldArticle.article.illustration !== null) {
      imageUpload = deleteArticleIllustration(id);
    }

    return imageUpload
      .then(() => updateArticle({ variables: { id, articleInput } }))
      .then(() => onSuccess())
      .catch((error) => onError(error));
  };

  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      <Query<GetArticleQuery, GetArticleQueryVariables>
        query={GetArticle}
        variables={{ id: params.id ?? '' }}
      >
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
                { query: GetArticle, variables: { id: params.id ?? '' } },
              ]}
            >
              {(updateArticle) => {
                return (
                  <ArticleForm
                    article={data.article}
                    onSubmit={onSubmit(updateArticle, data)}
                    title="Upravit článek"
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
