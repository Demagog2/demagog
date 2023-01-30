import * as React from 'react';

import { Mutation, MutationFunction } from 'react-apollo';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';

import { addFlashMessage } from '../actions/flashMessages';
import { uploadSpeakerAvatar } from '../api';

import { ISpeakerFormData, SpeakerForm } from './forms/SpeakerForm';

import {
  CreateSpeaker as CreateSpeakerMutation,
  CreateSpeakerVariables as CreateSpeakerMutationVariables,
} from '../operation-result-types';
import { CreateSpeaker } from '../queries/mutations';
import { GetSpeakers } from '../queries/queries';

interface ICreateSpeakerMutationFn
  extends MutationFunction<CreateSpeakerMutation, CreateSpeakerMutationVariables> {}

export function SpeakerNew() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onCompleted = (speakerId: number) => {
    dispatch(addFlashMessage('Osoba byla úspěšně uložena.', 'success'));
    navigate(`/admin/speakers/edit/${speakerId}`);
  };

  const onError = (error: any) => {
    dispatch(addFlashMessage('Při ukládání došlo k chybě.', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  const onFormSubmit = (createSpeaker: ICreateSpeakerMutationFn) => {
    return (speakerFormData: ISpeakerFormData) => {
      const { avatar, ...speakerInput } = speakerFormData;

      return createSpeaker({ variables: { speakerInput } })
        .then((mutationResult) => {
          if (!mutationResult || !mutationResult.data || !mutationResult.data.createSpeaker) {
            return;
          }

          const speakerId: number = parseInt(mutationResult.data.createSpeaker.speaker.id, 10);

          let uploadPromise: Promise<any> = Promise.resolve();
          if (avatar instanceof File) {
            uploadPromise = uploadSpeakerAvatar(speakerId, avatar);
          }

          uploadPromise.then(() => onCompleted(speakerId));
        })
        .catch((error) => onError(error));
    };
  };

  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      <Mutation<CreateSpeakerMutation, CreateSpeakerMutationVariables>
        mutation={CreateSpeaker}
        refetchQueries={[{ query: GetSpeakers, variables: { name: '' } }]}
      >
        {(createSpeaker) => (
          <SpeakerForm onSubmit={onFormSubmit(createSpeaker)} title="Přidat novou osobu" />
        )}
      </Mutation>
    </div>
  );
}
