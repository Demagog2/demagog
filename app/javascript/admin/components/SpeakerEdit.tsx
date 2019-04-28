import * as React from 'react';

import { Mutation, MutationFn, Query } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { addFlashMessage } from '../actions/flashMessages';
import { deleteSpeakerAvatar, uploadSpeakerAvatar } from '../api';
import Error from './Error';
import Loading from './Loading';

import { ISpeakerFormData, SpeakerForm } from './forms/SpeakerForm';

import {
  GetSpeakerQuery,
  GetSpeakerQueryVariables,
  UpdateSpeakerMutation,
  UpdateSpeakerMutationVariables,
} from '../operation-result-types';
import { UpdateSpeaker } from '../queries/mutations';
import { GetSpeaker } from '../queries/queries';

class GetSpeakerQueryComponent extends Query<GetSpeakerQuery, GetSpeakerQueryVariables> {}

class UpdateSpeakerMutationComponent extends Mutation<
  UpdateSpeakerMutation,
  UpdateSpeakerMutationVariables
> {}
interface IUpdateSpeakerMutationFn
  extends MutationFn<UpdateSpeakerMutation, UpdateSpeakerMutationVariables> {}

interface ISpeakerEditProps extends RouteComponentProps<{ id: string }>, DispatchProp {
  id: number;
}

class SpeakerEdit extends React.Component<ISpeakerEditProps> {
  public onFormSubmit = (
    id: number,
    updateSpeaker: IUpdateSpeakerMutationFn,
    previousData: GetSpeakerQuery,
  ) => (speakerFormData: ISpeakerFormData) => {
    const { avatar, ...speakerInput } = speakerFormData;

    this.setState({ submitting: true });

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
      .then(() => {
        this.setState({ submitting: false });
        this.onCompleted();
      })
      .catch((error) => {
        this.setState({ submitting: false });
        this.onError(error);
      });
  };

  public onCompleted = () => {
    this.props.dispatch(addFlashMessage('Uložení proběhlo v pořádku', 'success'));
  };

  public onError = (error: any) => {
    this.props.dispatch(addFlashMessage('Doško k chybě při uložení dat', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  public render() {
    const id = parseInt(this.props.match.params.id, 10);

    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <GetSpeakerQueryComponent query={GetSpeaker} variables={{ id }}>
          {({ data, loading, error }) => {
            if (loading || !data) {
              return <Loading />;
            }

            if (error) {
              return <Error error={error} />;
            }

            return (
              <UpdateSpeakerMutationComponent mutation={UpdateSpeaker}>
                {(updateSpeaker) => (
                  <SpeakerForm
                    speaker={data.speaker}
                    onSubmit={this.onFormSubmit(id, updateSpeaker, data)}
                    title="Upravit osobu"
                  />
                )}
              </UpdateSpeakerMutationComponent>
            );
          }}
        </GetSpeakerQueryComponent>
      </div>
    );
  }
}

export default connect()(SpeakerEdit);
