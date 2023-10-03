import * as React from 'react';
import type { MutationFunction } from 'react-apollo';
import { Mutation, Query } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { addFlashMessage } from '../../actions/flashMessages';
import type {
  GetMediaPersonality as GetMediaPersonalityQuery,
  GetMediaPersonalityVariables as GetMediaPersonalityQueryVariables,
  MediaPersonalityInput,
  UpdateMediaPersonality as UpdateMediaPersonalityMutation,
  UpdateMediaPersonalityVariables as UpdateMediaPersonalityMutationVariables,
} from '../../operation-result-types';
import { UpdateMediaPersonality } from '../../queries/mutations';
import {
  GetMediaPersonalities,
  GetMediaPersonalitiesForSelect,
  GetMediaPersonality,
} from '../../queries/queries';
import { MediaPersonalityForm } from '../forms/MediaPersonalityForm';
import Loading from '../Loading';

type UpdateMediaPersonalityMutationFn = MutationFunction<
UpdateMediaPersonalityMutation,
UpdateMediaPersonalityMutationVariables
>;

export function MediaPersonalityEdit() {
  const params = useParams();
  const dispatch = useDispatch();

  const onSuccess = () => {
    dispatch(addFlashMessage('Moderátor byl úspěšně uložen.', 'success'));
  };

  const onError = (error) => {
    dispatch(addFlashMessage('Došlo k chybě při ukládání moderátora.', 'error'));
    console.error(error);
  };

  const onSubmit = (updateMediaPersonality: UpdateMediaPersonalityMutationFn) => async(
    mediaPersonalityInput: MediaPersonalityInput,
  ) => {
    const id = params.id ?? '';

    await updateMediaPersonality({ variables: { id, mediaPersonalityInput } })
      .then(() => { onSuccess(); })
      .catch((error) => { onError(error); });
  };

  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      <Query<GetMediaPersonalityQuery, GetMediaPersonalityQueryVariables>
        query={GetMediaPersonality}
        variables={{ id: params.id ?? '' }}
      >
        {({ data, loading }) => {
          if (loading) {
            return <Loading />;
          }

          if (!data) {
            return null;
          }

          return (
            <Mutation<UpdateMediaPersonalityMutation, UpdateMediaPersonalityMutationVariables>
              mutation={UpdateMediaPersonality}
              refetchQueries={[
                { query: GetMediaPersonalities, variables: { name: '' } },
                { query: GetMediaPersonality, variables: { id: params.id ?? '' } },
                { query: GetMediaPersonalitiesForSelect },
              ]}
            >
              {(updateMediaPersonality) => {
                return (
                  <MediaPersonalityForm
                    mediaPersonality={data.mediaPersonality}
                    onSubmit={onSubmit(updateMediaPersonality)}
                    title="Upravit moderátory"
                  />
                );
              }}
            </Mutation>
          );
        }}
      </Query>
    </div>
  );
}
