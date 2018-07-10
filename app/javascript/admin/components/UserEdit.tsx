import * as React from 'react';

import { Mutation, MutationFn, Query } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { fetchCurrentUser } from '../actions/currentUser';
import { addFlashMessage } from '../actions/flashMessages';
import { deleteUserAvatar, uploadUserAvatar } from '../api';
import { IState } from '../reducers';
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

interface IUserEditProps extends RouteComponentProps<{ id: string }> {
  id: number;
  currentUser: IState['currentUser']['user'];
  dispatch: Dispatch;
}

class UserEdit extends React.Component<IUserEditProps> {
  public onFormSubmit = (
    id: number,
    updateUser: IUpdateUserMutationFn,
    previousData: GetUserQueryData,
  ) => (formData: IUserFormData) => {
    const { avatar, ...userInput } = formData;

    // TODO: do not allow deactivating ourselves

    // We want to first update the avatar and then run mutation so the avatar
    // gets automatically refresh in Apollo's cache from the mutation result data
    let avatarPromise: Promise<any> = Promise.resolve();
    if (avatar instanceof File) {
      avatarPromise = uploadUserAvatar(id, avatar);
    } else if (avatar === null && previousData.user.avatar !== null) {
      avatarPromise = deleteUserAvatar(id);
    }

    return avatarPromise
      .then(() => updateUser({ variables: { id, userInput } }))
      .then(() => {
        this.onCompleted();
      })
      .catch((error) => {
        this.onError(error);
      });
  };

  public onCompleted = () => {
    this.props.dispatch(addFlashMessage('Uložení proběhlo v pořádku', 'success'));

    if (this.props.currentUser && this.props.match.params.id === this.props.currentUser.id) {
      // When we are editing ourselves, lets update the currentUser info
      this.props.dispatch(fetchCurrentUser());
    }
  };

  public onError = (error: any) => {
    this.props.dispatch(addFlashMessage('Doško k chybě při uložení dat', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  public render() {
    const id = parseInt(this.props.match.params.id, 10);

    return (
      <div style={{ padding: '15px 0 40px 0' }}>
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
                    onSubmit={this.onFormSubmit(id, updateUser, data)}
                    // submitting={submitting}
                    title="Upravit člena týmu"
                    user={data.user}
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

const mapStateToProps = (state: IState) => ({
  currentUser: state.currentUser.user,
});

export default connect(mapStateToProps)(UserEdit);
