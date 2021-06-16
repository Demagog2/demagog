import * as React from 'react';
import { DeleteSource } from '../../queries/mutations';
import { GetSource, GetSources } from '../../queries/queries';
import { useMutation } from 'react-apollo';
import { useFlashMessage } from '../../hooks/use-flash-messages';
import { useHistory } from 'react-router-dom';
import { DeleteSourceVariables } from '../../operation-result-types';
import { RemoveSourceModal } from './RemoveSourceModal';

interface ISourceModalContainerProps {
  sourceId: string;
  sourceName: string;
  onClose(): void;
}

export function RemoveSourceModalContainer(props: ISourceModalContainerProps) {
  const addFlashMessage = useFlashMessage();
  const { push } = useHistory();

  const [mutate, { loading }] = useMutation<any, DeleteSourceVariables>(DeleteSource, {
    variables: {
      id: props.sourceId,
    },
    onError() {
      addFlashMessage('Došlo k chybě při mazání diskuze', 'error');
    },
    onCompleted() {
      addFlashMessage('Diskuze včetně jejích výroků byla úspěšně smazána.', 'success');
      push('/admin/sources');
    },
    refetchQueries: [
      {
        query: GetSource,
        variables: { id: parseInt(props.sourceId, 10) },
      },
      {
        query: GetSources,
        variables: { name: null },
      },
    ],
  });

  return (
    <RemoveSourceModal
      sourceName={props.sourceName}
      loading={loading}
      onClose={props.onClose}
      onConfirm={mutate}
    />
  );
}
