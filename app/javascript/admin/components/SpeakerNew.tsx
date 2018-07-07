import * as React from 'react';

import { Mutation, MutationFn } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import { uploadSpeakerAvatar } from '../api';

import { ISpeakerFormData, SpeakerForm } from './forms/SpeakerForm';

import { CreateSpeakerMutation, CreateSpeakerMutationVariables } from '../operation-result-types';
import { CreateSpeaker } from '../queries/mutations';

class CreateSpeakerMutationComponent extends Mutation<
  CreateSpeakerMutation,
  CreateSpeakerMutationVariables
> {}
interface ICreateSpeakerMutationFn
  extends MutationFn<CreateSpeakerMutation, CreateSpeakerMutationVariables> {}

interface ISpeakerNewProps extends RouteComponentProps<{}> {
  dispatch: Dispatch;
}

interface ISpeakerNewState {
  submitting: boolean;
}

class SpeakerNew extends React.Component<ISpeakerNewProps, ISpeakerNewState> {
  public state = {
    submitting: false,
  };

  private onFormSubmit = (createSpeaker: ICreateSpeakerMutationFn) => (
    speakerFormData: ISpeakerFormData,
  ) => {
    const { avatar, ...speakerInput } = speakerFormData;

    this.setState({ submitting: true });

    createSpeaker({ variables: { speakerInput } })
      .then((mutationResult) => {
        if (!mutationResult || !mutationResult.data || !mutationResult.data.createSpeaker) {
          return;
        }

        const speakerId: number = parseInt(mutationResult.data.createSpeaker.id, 10);

        let uploadPromise: Promise<any> = Promise.resolve();
        if (avatar instanceof File) {
          uploadPromise = uploadSpeakerAvatar(speakerId, avatar);
        }

        uploadPromise.then(() => {
          this.setState({ submitting: false });
          this.onCompleted(speakerId);
        });
      })
      .catch((error) => {
        this.setState({ submitting: false });
        this.onError(error);
      });
  };

  private onCompleted = (speakerId: number) => {
    this.props.dispatch(addFlashMessage('Osoba byla úspěšně uložena.', 'success'));
    this.props.history.push(`/admin/speakers/edit/${speakerId}`);
  };

  private onError = (error: any) => {
    this.props.dispatch(addFlashMessage('Při ukládání došlo k chybě.', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  // tslint:disable-next-line:member-ordering
  public render() {
    const { submitting } = this.state;

    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <CreateSpeakerMutationComponent mutation={CreateSpeaker}>
          {(createSpeaker) => (
            <SpeakerForm
              onSubmit={this.onFormSubmit(createSpeaker)}
              submitting={submitting}
              title="Přidat novou osobu"
            />
          )}
        </CreateSpeakerMutationComponent>
      </div>
    );
  }
}

export default connect()(withRouter(SpeakerNew));
