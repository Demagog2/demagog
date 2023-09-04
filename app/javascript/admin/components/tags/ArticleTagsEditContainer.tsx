import React, { useCallback } from 'react';
import { useParams } from 'react-router';
import Loading from '../Loading';
import { ArticleTagForm, IArticleTagFormValues } from '../forms/ArticleTagForm';
import { useMutation, useQuery } from 'react-apollo';
import { useFlashMessage } from '../../hooks/use-flash-messages';
import { useSelector, useDispatch } from 'react-redux';

import { IState } from '../../reducers';

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
  const dispatch = useDispatch();
  const currentUser = useSelector((state: IState) => state.currentUser.user);
  const articleTagId = parseInt(params.id ?? '', 10);
  const addFlashMessage = useFlashMessage();
  const [mutate] = useMutation<UpdateArticleTag, UpdateArticleTagVariables>(UpdateArticleTagMutation);
  const { data, loading } = useQuery<GetArticleTag, GetArticleTagVariables>(GetArticleTagQuery, {
    variables: {
      id: articleTagId,
    },
  });

  const onCompleted = useCallback(() => {
    addFlashMessage('Uložení proběhlo v pořádku', 'success');
  }, [addFlashMessage, dispatch, currentUser, articleTagId]);

  const onError = useCallback(
    (error) => {
      addFlashMessage('Při ukládání došlo k chybě.', 'error');
      console.log(error);

    },
    [addFlashMessage],
  );

  const onSubmit = useCallback(
    async (variables: IArticleTagFormValues) => {
      try {
        console.log(variables);

        await mutate({
          variables: {
            id: articleTagId,
            articleTagInput: {
              title: variables.title,
              slug: variables.slug,
              description: variables.description,
              icon: variables.icon,
              published: variables.published,
              stats: variables.stats,
              order: variables.order,
              video: variables.video,
              medium_id: variables.medium_id
            },
          }
        });
        onCompleted();
      } catch (error) {
        onError(error);
      }
    },
    [mutate, data, articleTagId, onCompleted, onError, addFlashMessage],
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
