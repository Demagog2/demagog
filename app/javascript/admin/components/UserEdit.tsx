import * as React from 'react';

import { Mutation, MutationFn, Query } from 'react-apollo';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { addFlashMessage } from '../actions/flashMessages';
import { deleteUserAvatar, uploadUserAvatar } from '../api';
import Error from './Error';
import Loading from './Loading';

import {
  GetUserQuery as GetUserQueryData,
  GetUserQueryVariables,
  UpdateUserMutation,
  UpdateUserMutationVariables,
} from '../operation-result-types';
import { UpdateUser } from '../queries/mutations';
import { GetUser } from '../queries/queries';
import { IUserFormData, UserForm } from './forms/UserForm';

class GetUserQuery extends Query<GetUserQueryData, GetUserQueryVariables> {}

class UpdateUserMutationComponent extends Mutation<
  UpdateUserMutation,
  UpdateUserMutationVariables
> {}

interface IUpdateUserMutationFn
  extends MutationFn<UpdateUserMutation, UpdateUserMutationVariables> {}

interface ISpeakerEditProps extends RouteComponentProps<{ id: string }> {
  id: number;
  addFlashMessage: (message: string) => void;
}

interface ISpeakerEditState {
  submitting: boolean;
}

class UserEdit extends React.Component<ISpeakerEditProps, ISpeakerEditState> {
  public state = {
    submitting: false,
  };

  private onFormSubmit = (
    id: number,
    updateUser: IUpdateUserMutationFn,
    previousData: GetUserQueryData,
  ) => (speakerFormData: IUserFormData) => {
    const { avatar, ...userInput } = speakerFormData;

    this.setState({ submitting: true });

    // We want to first update the avatar and then run mutation so the avatar
    // gets automatically refresh in Apollo's cache from the mutation result data
    let avatarPromise: Promise<any> = Promise.resolve();
    if (avatar instanceof File) {
      avatarPromise = uploadUserAvatar(id, avatar);
    } else if (avatar === null && previousData.user.avatar !== null) {
      avatarPromise = deleteUserAvatar(id);
    }

    avatarPromise
      .then(() => updateUser({ variables: { id, userInput } }))
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
        <h1>Upravit člena týmu</h1>

        <GetUserQuery query={GetUser} variables={{ id }}>
          {({ data, loading, error }) => {
            if (loading || !data) {
              return <Loading />;
            }

            if (error) {
              return <Error error={error} />;
            }

            return (
              <UpdateUserMutationComponent mutation={UpdateUser}>
                {(updateUser) => (
                  <UserForm
                    userQuery={data}
                    onSubmit={this.onFormSubmit(id, updateUser, data)}
                    submitting={submitting}
                  />
                )}
              </UpdateUserMutationComponent>
            );
          }}
        </GetUserQuery>
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
)(UserEdit);
