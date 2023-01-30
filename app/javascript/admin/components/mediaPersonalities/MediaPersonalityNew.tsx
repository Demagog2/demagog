import * as React from 'react';

import { Mutation, MutationFunction } from 'react-apollo';
import { useDispatch } from 'react-redux';

import { addFlashMessage } from '../../actions/flashMessages';
import {
  CreateMediaPersonality as CreateMediaPersonalityMutation,
  CreateMediaPersonalityVariables as CreateMediaPersonalityMutationVariables,
  MediaPersonalityInput,
} from '../../operation-result-types';
import { CreateMediaPersonality } from '../../queries/mutations';
import { GetMediaPersonalitiesForSelect } from '../../queries/queries';
import { MediaPersonalityForm } from '../forms/MediaPersonalityForm';
import { useNavigate } from 'react-router';

type CreateMediaPersonalityMutationFn = MutationFunction<
  CreateMediaPersonalityMutation,
  CreateMediaPersonalityMutationVariables
>;

export function MediaPersonalityNew() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSuccess = (mediumId: string) => {
    dispatch(addFlashMessage('Moderátor byl úspěšně uložen.', 'success'));

    navigate(`/admin/media-personalities/edit/${mediumId}`);
  };

  const onError = (error) => {
    dispatch(addFlashMessage('Došlo k chybě při ukládání moderátora.', 'error'));
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  const onSubmit = (createMediaPersonality: CreateMediaPersonalityMutationFn) => (
    mediaPersonalityInput: MediaPersonalityInput,
  ) => {
    return createMediaPersonality({ variables: { mediaPersonalityInput } })
      .then((mutationResult) => {
        if (
          !mutationResult ||
          !mutationResult.data ||
          !mutationResult.data.createMediaPersonality
        ) {
          return;
        }

        const mediumId = mutationResult.data.createMediaPersonality.mediaPersonality.id;

        onSuccess(mediumId);
      })
      .catch((error) => onError(error));
  };

  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      <Mutation<CreateMediaPersonalityMutation, CreateMediaPersonalityMutationVariables>
        mutation={CreateMediaPersonality}
        // TODO: is there a nicer way of updating apollo cache after creating?
        refetchQueries={[{ query: GetMediaPersonalitiesForSelect }]}
      >
        {(createMedium) => {
          return (
            <MediaPersonalityForm
              onSubmit={onSubmit(createMedium)}
              title="Přidat nové moderátory"
            />
          );
        }}
      </Mutation>
    </div>
  );
}
