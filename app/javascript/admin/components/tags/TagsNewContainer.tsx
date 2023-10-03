import React, { useCallback } from 'react';
import { useMutation } from 'react-apollo';
import { useNavigate } from 'react-router-dom';
import { captureException } from '@sentry/browser';
import type * as ResultTypes from '../../operation-result-types';
import { CreateTag } from '../../queries/mutations';
import type { ITagFormValues } from '../forms/TagForm';
import { TagForm } from '../forms/TagForm';
import { useFlashMessage } from '../../hooks/use-flash-messages';

export function TagsNewContainer() {
  const navigate = useNavigate();
  const addFlashMessage = useFlashMessage();
  const [mutate] = useMutation<ResultTypes.CreateTag, ResultTypes.CreateTagVariables>(CreateTag, {
    onCompleted() {
      addFlashMessage('Štítek byl úspešně vytvořen.', 'success');
      navigate('/admin/tags');
    },
    onError(error) {
      addFlashMessage('Při ukládání došlo k chybě.', 'error');
      captureException(error);
    },
  });

  const onSubmit = useCallback(
    async(variables: ITagFormValues) => {
      await mutate({
        variables: {
          tagInput: {
            name: variables.name,
            forStatementType: variables.forStatementType,
          },
        },
      });
    },
    [mutate],
  );

  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      <TagForm onSubmit={onSubmit} />
    </div>
  );
}
