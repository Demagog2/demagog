import { useFlashMessage } from '../../hooks/use-flash-messages';
import { useMutation } from 'react-apollo';
import type {
  PublishApprovedSourceStatements as MutationReturnType,
  PublishApprovedSourceStatementsVariables,
} from '../../operation-result-types';
import { PublishApprovedSourceStatements } from '../../queries/mutations';
import * as React from 'react';
import { MassStatementsPublishModal } from './MassStatementsPublishModal';

export function MassStatementsPublishModalContainer(props: {
  sourceId: string;
  readyToPublishStatementsCount: number;
  onClose: () => void;
}) {
  const addFlashMessage = useFlashMessage();
  const [mutate, { loading }] = useMutation<
  MutationReturnType,
  PublishApprovedSourceStatementsVariables
  >(PublishApprovedSourceStatements, {
    onError() {
      addFlashMessage('Došlo k chybě při zveřejňování výroků', 'error');
    },
    onCompleted() {
      addFlashMessage(
        'Úspěšně zveřejněny všechny schválené a dosud nezveřejněné výroky.',
        'success',
      );
    },
  });

  return (
    <MassStatementsPublishModal
      readyToPublishStatementsCount={props.readyToPublishStatementsCount}
      onConfirm={async() => await mutate({ variables: { id: props.sourceId } })}
      isSaving={loading}
      onClose={props.onClose}
    />
  );
}
