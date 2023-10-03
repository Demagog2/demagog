import * as React from 'react';

import type { MutationFunction } from 'react-apollo';
import { Mutation } from 'react-apollo';

import { addFlashMessage } from '../../actions/flashMessages';
import type {
  CreateMedium as CreateMediumMutation,
  CreateMediumVariables as CreateMediumMutationVariables,
  MediumInput,
} from '../../operation-result-types';
import { CreateMedium } from '../../queries/mutations';
import { GetMedia, GetMediaPersonalitiesForSelect } from '../../queries/queries';
import { MediumForm } from '../forms/MediumForm';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

type CreateMediumMutationFn = MutationFunction<CreateMediumMutation, CreateMediumMutationVariables>;

export function MediumNew() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSuccess = (mediumId: string) => {
    dispatch(addFlashMessage('Pořad byl úspěšně uložen.', 'success'));

    navigate(`/admin/media/edit/${mediumId}`);
  };

  const onError = (error) => {
    dispatch(addFlashMessage('Došlo k chybě při ukládání pořadu.', 'error'));
    console.error(error);
  };

  const onSubmit = (createMedium: CreateMediumMutationFn) => async(mediumInput: MediumInput) => {
    await createMedium({ variables: { mediumInput } })
      .then((mutationResult) => {
        if (!mutationResult || !mutationResult.data?.createMedium) {
          return;
        }

        const mediumId = mutationResult.data.createMedium.medium.id;

        onSuccess(mediumId);
      })
      .catch((error) => { onError(error); });
  };

  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      <Mutation<CreateMediumMutation, CreateMediumMutationVariables>
        mutation={CreateMedium}
        // TODO: is there a nicer way of updating apollo cache after creating?
        refetchQueries={[
          { query: GetMedia, variables: { name: '' } },
          { query: GetMediaPersonalitiesForSelect },
        ]}
      >
        {(createMedium) => {
          return <MediumForm onSubmit={onSubmit(createMedium)} title="Přidat nový pořad" />;
        }}
      </Mutation>
    </div>
  );
}
