import * as React from 'react';

import type { MutationFunction } from 'react-apollo';
import { Mutation } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { addFlashMessage } from '../../actions/flashMessages';
import { uploadArticleIllustration } from '../../api';
import type {
  ArticleInput,
  CreateArticle as CreateArticleMutation,
  CreateArticleVariables as CreateArticleMutationVariables,
} from '../../operation-result-types';
import { CreateArticle } from '../../queries/mutations';
import { GetArticles } from '../../queries/queries';
import { ArticleForm } from './ArticleForm';

type CreateArticleMutationFn = MutationFunction<
CreateArticleMutation,
CreateArticleMutationVariables
>;

export function ArticleNew() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSuccess = (articleId: string) => {
    dispatch(addFlashMessage('Článek byl úspěšně uložen.', 'success'));

    navigate(`/admin/articles/edit/${articleId}`);
  };

  const onError = (error) => {
    dispatch(addFlashMessage('Došlo k chybě při ukládání článku', 'error'));
    console.error(error);
  };

  const onSubmit = (createArticle: CreateArticleMutationFn) => async(
    articleFormData: ArticleInput & { illustration?: File },
  ) => {
    const { illustration, ...articleInput } = articleFormData;

    await createArticle({ variables: { articleInput } })
      .then(async(mutationResult) => {
        if (!mutationResult || !mutationResult.data?.createArticle) {
          return;
        }

        const articleId = mutationResult.data.createArticle.article.id;

        let uploadPromise: Promise<any> = Promise.resolve();

        if (illustration instanceof File) {
          uploadPromise = uploadArticleIllustration(articleId, illustration);
        }

        await uploadPromise.then(() => { onSuccess(articleId); });
      })
      .catch((error) => { onError(error); });
  };

  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      <Mutation<CreateArticleMutation, CreateArticleMutationVariables>
        mutation={CreateArticle}
        // TODO: is there a nicer way of updating apollo cache after creating?
        refetchQueries={[{ query: GetArticles, variables: { title: '', offset: 0, limit: 50 } }]}
      >
        {(createArticle) => {
          return (
            <ArticleForm
              onSubmit={onSubmit(createArticle)}
              title="Přidat nový článek"
              backPath="/admin/articles"
            />
          );
        }}
      </Mutation>
    </div>
  );
}
