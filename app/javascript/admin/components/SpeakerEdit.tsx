import * as React from 'react';

import { Mutation, MutationFunction, Query } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import { addFlashMessage } from '../actions/flashMessages';
import { deleteSpeakerAvatar, uploadSpeakerAvatar } from '../api';
import Error from './Error';
import Loading from './Loading';

import { ISpeakerFormData, SpeakerForm } from './forms/SpeakerForm';

import {
  GetSpeaker as GetSpeakerQuery,
  GetSpeakerVariables as GetSpeakerQueryVariables,
  UpdateSpeaker as UpdateSpeakerMutation,
  UpdateSpeakerVariables as UpdateSpeakerMutationVariables,
} from '../operation-result-types';
import { UpdateSpeaker } from '../queries/mutations';
import { GetSpeaker } from '../queries/queries';

interface IUpdateSpeakerMutationFn
  extends MutationFunction<UpdateSpeakerMutation, UpdateSpeakerMutationVariables> {}

export function SpeakerEdit() {
  const params = useParams();
  const dispatch = useDispatch();

  const id = parseInt(params.id ?? '', 10);

  const onFormSubmit = (updateSpeaker: IUpdateSpeakerMutationFn, previousData: GetSpeakerQuery) => (
    speakerFormData: ISpeakerFormData,
  ) => {
    const { avatar, ...speakerInput } = speakerFormData;

    // We want to first update the avatar and then run mutation so the avatar
    // gets automatically refresh in Apollo's cache from the mutation result data
    let avatarPromise: Promise<any> = Promise.resolve();
    if (avatar instanceof File) {
      avatarPromise = uploadSpeakerAvatar(id, avatar);
    } else if (avatar === null && previousData.speaker.avatar !== null) {
      avatarPromise = deleteSpeakerAvatar(id);
    }

    return avatarPromise
      .then(() => updateSpeaker({ variables: { id: id.toString(), speakerInput } }))
      .then(() => onCompleted())
      .catch((error) => onError(error));
  };

  const onCompleted = () => {
    dispatch(addFlashMessage('Uložení proběhlo v pořádku', 'success'));
  };

  const onError = (error: any) => {
    dispatch(addFlashMessage('Doško k chybě při uložení dat', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      <Query<GetSpeakerQuery, GetSpeakerQueryVariables> query={GetSpeaker} variables={{ id }}>
        {({ data, loading, error }) => {
          if (loading || !data) {
            return <Loading />;
          }

          if (error) {
            return <Error error={error} />;
          }

          return (
            <Mutation<UpdateSpeakerMutation, UpdateSpeakerMutationVariables>
              mutation={UpdateSpeaker}
            >
              {(updateSpeaker) => (
                <SpeakerForm
                  speaker={data.speaker}
                  onSubmit={onFormSubmit(updateSpeaker, data)}
                  title="Upravit osobu"
                />
              )}
            </Mutation>
          );
        }}
      </Query>
    </div>
  );
}
