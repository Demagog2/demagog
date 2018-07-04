import * as React from 'react';

import { Mutation, MutationFn } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import { uploadUserAvatar } from '../api';

import { CreateUserMutation, CreateUserMutationVariables } from '../operation-result-types';
import { CreateUser } from '../queries/mutations';
import { IUserFormData, UserForm } from './forms/UserForm';

class CreateUserMutationComponent extends Mutation<
  CreateUserMutation,
  CreateUserMutationVariables
> {}

interface ICreateUserMutationFn
  extends MutationFn<CreateUserMutation, CreateUserMutationVariables> {}

interface IUserNewProps extends RouteComponentProps<{}> {
  dispatch: Dispatch;
}

interface IUserNewState {
  submitting: boolean;
}

class UserNew extends React.Component<IUserNewProps, IUserNewState> {
  public state = {
    submitting: false,
  };

  private onFormSubmit = (createUser: ICreateUserMutationFn) => (
    speakerFormData: IUserFormData,
  ) => {
    const { avatar, ...userInput } = speakerFormData;

    this.setState({ submitting: true });

    createUser({ variables: { userInput } })
      .then((mutationResult) => {
        if (!mutationResult || !mutationResult.data || !mutationResult.data.createUser) {
          return;
        }

        const userId: number = parseInt(mutationResult.data.createUser.id, 10);

        let uploadPromise: Promise<any> = Promise.resolve();
        if (avatar instanceof File) {
          uploadPromise = uploadUserAvatar(userId, avatar);
        }

        uploadPromise.then(() => {
          this.setState({ submitting: false });
          this.onCompleted(userId);
        });
      })
      .catch((error) => {
        this.setState({ submitting: false });
        this.onError(error);
      });
  };

  private onCompleted = (speakerId: number) => {
    this.props.dispatch(addFlashMessage('Osoba byla úspěšně uložena.', 'success'));
    this.props.history.push(`/admin/users/edit/${speakerId}`);
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
        <CreateUserMutationComponent mutation={CreateUser}>
          {(createUser) => (
            <UserForm
              onSubmit={this.onFormSubmit(createUser)}
              submitting={submitting}
              title="Přidat nového člena týmu"
            />
          )}
        </CreateUserMutationComponent>
      </div>
    );
  }
}

export default connect()(withRouter(UserNew));
