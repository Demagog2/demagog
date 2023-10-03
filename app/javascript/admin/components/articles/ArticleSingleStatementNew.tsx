import React, { useCallback } from 'react';

import { useMutation } from 'react-apollo';
import { useDispatch } from 'react-redux';

import { addFlashMessage } from '../../actions/flashMessages';
import { uploadArticleIllustration } from '../../api';
import type {
  ArticleInput,
  CreateArticle as CreateArticleMutation,
  CreateArticleVariables as CreateArticleMutationVariables,
} from '../../operation-result-types';
import { CreateArticle } from '../../queries/mutations';
import { GetArticles } from '../../queries/queries';
import { ArticleSingleStatementForm } from './ArticleSingleStatementForm';
import { useNavigate } from 'react-router';

export default function ArticleSingleStatementNew() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSuccess = useCallback(
    (articleId: string) => {
      dispatch(addFlashMessage('Článek byl úspěšně uložen.', 'success'));

      navigate(`/admin/articles/edit-single-statement/${articleId}`);
    },
    [dispatch, navigate],
  );

  const onError = useCallback(
    (error) => {
      dispatch(addFlashMessage('Došlo k chybě při ukládání článku', 'error'));

      console.error(error);
    },
    [dispatch],
  );

  const [mutation] = useMutation<CreateArticleMutation, CreateArticleMutationVariables>(
    CreateArticle,
    {
      refetchQueries: [{ query: GetArticles, variables: { title: '', offset: 0, limit: 50 } }],
    },
  );

  const onSubmit = useCallback(async(articleFormData: ArticleInput & { illustration?: File }) => {
    const { illustration, ...articleInput } = articleFormData;

    await mutation({ variables: { articleInput } })
      .then(async(mutationResult) => {
        if (!mutationResult?.data?.createArticle) {
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
  }, []);

  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      <ArticleSingleStatementForm
        onSubmit={onSubmit}
        title="Přidat jednotlivý výrok jako článek"
        backPath="/admin/articles"
      />
    </div>
  );
}
