import * as React from 'react';
import { useMutation } from 'react-apollo';
import { useNavigate } from 'react-router';

import { useFlashMessage } from '../hooks/use-flash-messages';
import type * as ResultTypes from '../operation-result-types';
import { CreateSource } from '../queries/mutations';
import { GetSources } from '../queries/queries';
import { SourceForm } from './forms/SourceForm';

const SourceNew = () => {
  const navigate = useNavigate();
  const addFlashMessage = useFlashMessage();

  const [createSource] = useMutation<ResultTypes.CreateSource, ResultTypes.CreateSourceVariables>(
    CreateSource,
    {
      onError(error) {
        addFlashMessage(
          error.message ? error.message : 'Došlo k chybě při ukládání diskuze',
          'error',
        );
        console.error(error);
      },
      onCompleted(source) {
        addFlashMessage('Diskuze byla úspěšně uložena.', 'success');

        if (source.createSource) {
          navigate(`/admin/sources/${source.createSource.source.id}`);
        }
      },
      refetchQueries: [{ query: GetSources, variables: { name: '', offset: 0, limit: 50 } }],
    },
  );

  const onSubmitHandler = React.useCallback(
    async(sourceInput: ResultTypes.SourceInput) => {
      return await createSource({ variables: { sourceInput } });
    },
    [createSource],
  );

  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      <SourceForm
        backPath="/admin/sources"
        onSubmit={onSubmitHandler}
        title="Přidat novou diskuzi"
      />
    </div>
  );
};

export default SourceNew;
