import * as React from 'react';
import { DateTime } from 'luxon';
import { useHistory, useParams } from 'react-router';
import { captureException } from '@sentry/browser';
import { useQuery, useMutation } from 'react-apollo';
import {
  GetSource as GetSourceQuery,
  GetSourceVariables as GetSourceQueryVariables,
  CreateStatement as CreateStatementMutation,
  CreateStatementVariables as CreateStatementMutationVariables,
  CreateStatementInput,
} from '../../operation-result-types';
import { GetSource } from '../../queries/queries';
import { CreateStatement } from '../../queries/mutations';
import { useFlashMessage } from '../../hooks/use-flash-messages';
import { StatementNew, IStatementNewFormValues } from './StatementNew';

function createStatementInput(
  sourceId: string,
  formValues: IStatementNewFormValues,
): CreateStatementInput {
  const note = formValues.note.trim();

  return {
    statementType: formValues.statement_type,
    content: formValues.content,
    speakerId: formValues.speaker_id ?? '',
    sourceId,
    important: false,
    published: false,
    excerptedAt: DateTime.utc().toISO(),
    assessment: {
      evaluatorId: formValues.evaluator_id,
      secondaryEvaluatorIds: formValues.secondary_evaluator_ids,
    },
    firstCommentContent: note !== '' ? note : null,
  };
}

export function StatementNewContainer() {
  const addFlashMessage = useFlashMessage();
  const { push } = useHistory();
  const { sourceId } = useParams<{ sourceId: string }>();
  const { data: source, loading, error } = useQuery<GetSourceQuery, GetSourceQueryVariables>(
    GetSource,
    {
      variables: {
        id: parseInt(sourceId, 10),
      },
    },
  );

  const [mutate, { loading: saving }] = useMutation<
    CreateStatementMutation,
    CreateStatementMutationVariables
  >(CreateStatement, {
    onCompleted() {
      addFlashMessage('Výrok byl úspěšně přidán.', 'success');
      push(`/admin/sources/${source?.source.id}`);
    },

    onError(mutationError) {
      addFlashMessage('Při ukládání došlo k chybě.', 'error');
      captureException(mutationError);
    },
  });

  return (
    <StatementNew
      source={source?.source}
      loading={loading}
      saving={saving}
      error={error}
      onSubmit={(values) => {
        const statementInput = createStatementInput(source?.source.id ?? '', values);

        mutate({ variables: { statementInput } });
      }}
    />
  );
}
