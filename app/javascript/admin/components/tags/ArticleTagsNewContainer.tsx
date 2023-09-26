import React, { useCallback } from 'react';
import { ArticleTagForm, IArticleTagFormValues } from '../forms/ArticleTagForm';
import * as ResultTypes from '../../operation-result-types';
import { useMutation } from 'react-apollo';
import { useNavigate } from 'react-router-dom';
import { CreateArticleTag } from '../../queries/mutations';
import { useFlashMessage } from '../../hooks/use-flash-messages';

export function ArticleTagsNewContainer() {
  const navigate = useNavigate();
  const addFlashMessage = useFlashMessage();

  const [mutate] = useMutation<ResultTypes.CreateArticleTag, ResultTypes.CreateArticleTagVariables>(
    CreateArticleTag,
    {
      onCompleted() {
        addFlashMessage('Tag byl úspešně vytvořen.', 'success');
        navigate('/admin/article-tags');
      },
      onError() {
        addFlashMessage('Při ukládání došlo k chybě.', 'error');
      },
    },
  );

  const onSubmit = useCallback(
    async (variables: IArticleTagFormValues) => {
      await mutate({
        variables: {
          articleTagInput: {
            title: variables.title,
            slug: variables.slug,
            description: variables.description,
            published: variables.published,
            icon: variables.icon,
            stats: variables.stats,
            order: variables.order,
          },
        },
      });
    },
    [mutate],
  );

  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      <ArticleTagForm title="Přidat tag" onSubmit={onSubmit} />
    </div>
  );
}
