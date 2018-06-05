import * as React from 'react';

import { Mutation, MutationFn, Query } from 'react-apollo';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { addFlashMessage } from '../actions/flashMessages';
import { deleteSpeakerAvatar, uploadSpeakerAvatar } from '../api';
import Error from './Error';
import Loading from './Loading';

import { ISpeakerFormData, SpeakerForm } from './forms/SpeakerForm';

import {
  GetSpeakerQuery,
  UpdateSpeakerMutation,
  UpdateSpeakerMutationVariables,
} from '../operation-result-types';
import { UpdateSpeaker } from '../queries/mutations';
import { GetSpeaker } from '../queries/queries';

class UpdateSpeakerMutationComponent extends Mutation<
  UpdateSpeakerMutation,
  UpdateSpeakerMutationVariables
> {}
interface IUpdateSpeakerMutationFn
  extends MutationFn<UpdateSpeakerMutation, UpdateSpeakerMutationVariables> {}

interface ISpeakerEditProps extends RouteComponentProps<{ id: string }> {
  id: number;
  addFlashMessage: (message: string) => void;
}

interface ISpeakerEditState {
  submitting: boolean;
}

class SpeakerEdit extends React.Component<ISpeakerEditProps, ISpeakerEditState> {
  public state = {
    submitting: false,
  };

  private onFormSubmit = (
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

    avatarPromise
      .then(() => updateSpeaker({ variables: { id, speakerInput } }))
      .then(() => {
        this.setState({ submitting: false });
        this.onCompleted();
      })
      .catch((error) => {
        this.setState({ submitting: false });
        this.onError(error);
      });
  };

  private onCompleted = () => {
    this.props.addFlashMessage('Uložení proběhlo v pořádku');
  };

  private onError = (error: any) => {
    this.props.addFlashMessage('Doško k chybě při uložení dat');

    console.error(error); // tslint:disable-line:no-console
  };

  // tslint:disable-next-line:member-ordering
  public render() {
    const { submitting } = this.state;

    const id = parseInt(this.props.match.params.id, 10);

    return (
      <div role="main">
        <h1>Upravit osobu</h1>

        <Query query={GetSpeaker} variables={{ id }}>
          {({ data, loading, error }) => {
            if (loading) {
              return <Loading />;
            }

            if (error) {
              return <Error error={error} />;
            }

            return (
              <UpdateSpeakerMutationComponent mutation={UpdateSpeaker}>
                {(updateSpeaker) => (
                  <SpeakerForm
                    speakerQuery={data}
                    onSubmit={this.onFormSubmit(id, updateSpeaker, data)}
                    submitting={submitting}
                  />
                )}
              </UpdateSpeakerMutationComponent>
            );
          }}
        </Query>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addFlashMessage(message: string) {
      dispatch(addFlashMessage(message));
    },
  };
}

export default connect(
  null,
  mapDispatchToProps,
)(SpeakerEdit);
