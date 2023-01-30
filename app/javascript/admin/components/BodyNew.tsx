import * as React from 'react';

import { Mutation, MutationFunction } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { addFlashMessage } from '../actions/flashMessages';
import { uploadBodyLogo } from '../api';
import {
  CreateBody as CreateBodyMutation,
  CreateBodyVariables as CreateBodyMutationVariables,
} from '../operation-result-types';
import { CreateBody } from '../queries/mutations';
import { GetBodies, GetSpeakerBodies } from '../queries/queries';
import { BodyForm, IBodyFormData } from './forms/BodyForm';

interface ICreateBodyMutationFn
  extends MutationFunction<CreateBodyMutation, CreateBodyMutationVariables> {}

export function BodyNew() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFormSubmit = (createBody: ICreateBodyMutationFn) => (bodyFormData: IBodyFormData) => {
    const { logo, ...bodyInput } = bodyFormData;

    return createBody({ variables: { bodyInput } })
      .then((mutationResult) => {
        if (!mutationResult || !mutationResult.data || !mutationResult.data.createBody) {
          return;
        }

        const bodyId: number = parseInt(mutationResult.data.createBody.body.id, 10);

        let uploadPromise: Promise<any> = Promise.resolve();
        if (logo instanceof File) {
          uploadPromise = uploadBodyLogo(bodyId, logo);
        }

        uploadPromise.then(() => {
          onCompleted(bodyId);
        });
      })
      .catch((error) => {
        onError(error);
      });
  };

  const onCompleted = (bodyId: number) => {
    dispatch(addFlashMessage('Strana / skupina byla úspěšně uložena.', 'success'));
    navigate(`/admin/bodies/edit/${bodyId}`);
  };

  const onError = (error: any) => {
    dispatch(addFlashMessage('Při ukládání došlo k chybě.', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      <Mutation<CreateBodyMutation, CreateBodyMutationVariables>
        mutation={CreateBody}
        refetchQueries={[
          { query: GetSpeakerBodies },
          { query: GetBodies, variables: { name: '' } },
        ]}
      >
        {(createBody) => (
          <BodyForm onSubmit={onFormSubmit(createBody)} title="Přidat novou stranu / skupinu" />
        )}
      </Mutation>
    </div>
  );
}
