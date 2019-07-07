import * as React from 'react';

import { Mutation, MutationFn } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import { uploadBodyLogo } from '../api';
import {
  CreateBody as CreateBodyMutation,
  CreateBodyVariables as CreateBodyMutationVariables,
} from '../operation-result-types';
import { CreateBody } from '../queries/mutations';
import { GetBodies, GetSpeakerBodies } from '../queries/queries';
import { BodyForm, IBodyFormData } from './forms/BodyForm';

class BodyNewMutation extends Mutation<CreateBodyMutation, CreateBodyMutationVariables> {}
interface ICreateBodyMutationFn
  extends MutationFn<CreateBodyMutation, CreateBodyMutationVariables> {}

interface IBodyNewProps extends RouteComponentProps<{}>, DispatchProp {}

// tslint:disable-next-line:max-classes-per-file
class BodyNew extends React.Component<IBodyNewProps> {
  public onFormSubmit = (createBody: ICreateBodyMutationFn) => (bodyFormData: IBodyFormData) => {
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
          this.onCompleted(bodyId);
        });
      })
      .catch((error) => {
        this.onError(error);
      });
  };

  public onCompleted = (bodyId: number) => {
    this.props.dispatch(addFlashMessage('Strana / skupina byla úspěšně uložena.', 'success'));
    this.props.history.push(`/admin/bodies/edit/${bodyId}`);
  };

  public onError = (error: any) => {
    this.props.dispatch(addFlashMessage('Při ukládání došlo k chybě.', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  public render() {
    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <BodyNewMutation
          mutation={CreateBody}
          refetchQueries={[
            { query: GetSpeakerBodies },
            { query: GetBodies, variables: { name: '' } },
          ]}
        >
          {(createBody) => (
            <BodyForm
              onSubmit={this.onFormSubmit(createBody)}
              title="Přidat novou stranu / skupinu"
            />
          )}
        </BodyNewMutation>
      </div>
    );
  }
}

export default connect()(withRouter(BodyNew));
