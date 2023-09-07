import React, { useCallback } from 'react';
import { useParams } from 'react-router';
import Loading from '../Loading';
import { ArticleTagForm, IArticleTagFormValues } from '../forms/ArticleTagForm';
import { useMutation, useQuery } from 'react-apollo';
import { useFlashMessage } from '../../hooks/use-flash-messages';

import {
  UpdateArticleTag,
  UpdateArticleTagVariables,
  GetArticleTag,
  GetArticleTagVariables,
} from '../../operation-result-types';

import { UpdateArticleTag as UpdateArticleTagMutation } from '../../queries/mutations';
import { GetArticleTag as GetArticleTagQuery } from '../../queries/queries';

export function ArticleTagsEditContainer() {
  const params = useParams();
  const addFlashMessage = useFlashMessage();
  const [mutate] = useMutation<UpdateArticleTag, UpdateArticleTagVariables>(
    UpdateArticleTagMutation,
  );
  const { data, loading } = useQuery<GetArticleTag, GetArticleTagVariables>(GetArticleTagQuery, {
    variables: {
      id: params.id ?? '',
    },
  });

  const onCompleted = useCallback(() => {
    addFlashMessage('Uložení proběhlo v pořádku', 'success');
  }, [addFlashMessage]);

  const onError = useCallback(() => {
    addFlashMessage('Při ukládání došlo k chybě.', 'error');
  }, [addFlashMessage]);

  const onSubmit = useCallback(
    async (variables: IArticleTagFormValues) => {
      try {
        await mutate({
          variables: {
            id: parseInt(params.id ?? '', 10),
            articleTagInput: {
              title: variables.title,
              slug: variables.slug,
              description: variables.description,
              icon: variables.icon,
              published: variables.published,
              stats: variables.stats,
              order: variables.order,
              video: variables.video,
            },
          },
        });
        onCompleted();
      } catch (error) {
        onError();
      }
    },
    [mutate, data, params.id, onCompleted, onError, addFlashMessage],
  );

  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      {loading ? (
        <Loading />
      ) : (
        <ArticleTagForm onSubmit={onSubmit} title="Upravit tag" articleTag={data?.articleTag} />
      )}
    </div>
  );
}
