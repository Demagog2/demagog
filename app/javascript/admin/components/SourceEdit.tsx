import { useMutation, useQuery } from '@apollo/client';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { useFlashMessage } from '../hooks/use-flash-messages';
import * as ResultTypes from '../operation-result-types';
import { UpdateSource } from '../queries/mutations';
import { GetSource, GetSources } from '../queries/queries';
import { SourceForm } from './forms/SourceForm';
import Loading from './Loading';

interface ISourceEditProps extends RouteComponentProps<{ id: string }> {}

const SourceEdit = (props: ISourceEditProps) => {
  const addFlashMessage = useFlashMessage();

  const sourceId = parseInt(props.match.params.id, 10);

  const { data: dataGetSource } = useQuery<ResultTypes.GetSource, ResultTypes.GetSourceVariables>(
    GetSource,
    {
      fetchPolicy: 'cache-and-network',
      variables: { id: sourceId },
    },
  );

  const [updateSource] = useMutation<ResultTypes.UpdateSource, ResultTypes.UpdateSourceVariables>(
    UpdateSource,
    {
      onError(error) {
        addFlashMessage(
          error.message ? error.message : 'Došlo k chybě při ukládání diskuze',
          'error',
        );
        // tslint:disable-next-line:no-console
        console.error(error);
      },
      onCompleted() {
        addFlashMessage('Diskuze byla úspěšně uložena.', 'success');
      },
      refetchQueries: [
        { query: GetSources, variables: { name: '', offset: 0, limit: 50 } },
        { query: GetSource, variables: { id: sourceId } },
      ],
    },
  );

  const onSubmitHandler = React.useCallback(
    (sourceInput: ResultTypes.SourceInput) => {
      return updateSource({ variables: { id: sourceId.toString(), sourceInput } });
    },
    [updateSource, sourceId],
  );

  if (!dataGetSource) {
    return <Loading />;
  }

  return (
    <div role="main" style={{ marginTop: 15 }}>
      <SourceForm
        backPath={`/admin/sources/${sourceId}`}
        source={dataGetSource.source}
        onSubmit={onSubmitHandler}
        title="Upravit údaje o diskuzi"
      />
    </div>
  );
};

export default SourceEdit;
