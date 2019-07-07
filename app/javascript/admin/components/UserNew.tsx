import * as React from 'react';

import { Mutation, MutationFn } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import { uploadUserAvatar } from '../api';

import {
  CreateUser as CreateUserMutation,
  CreateUserVariables as CreateUserMutationVariables,
} from '../operation-result-types';
import { CreateUser } from '../queries/mutations';
import { IUserFormData, UserForm } from './forms/UserForm';

class CreateUserMutationComponent extends Mutation<
  CreateUserMutation,
  CreateUserMutationVariables
> {}

interface ICreateUserMutationFn
  extends MutationFn<CreateUserMutation, CreateUserMutationVariables> {}

interface IUserNewProps extends RouteComponentProps<{}>, DispatchProp {}

class UserNew extends React.Component<IUserNewProps> {
  public onFormSubmit = (createUser: ICreateUserMutationFn) => (formData: IUserFormData) => {
    const { avatar, ...userInput } = formData;

    return createUser({ variables: { userInput } })
      .then((mutationResult) => {
        if (!mutationResult || !mutationResult.data || !mutationResult.data.createUser) {
          return;
        }

        const userId: number = parseInt(mutationResult.data.createUser.user.id, 10);

        let uploadPromise: Promise<any> = Promise.resolve();
        if (avatar instanceof File) {
          uploadPromise = uploadUserAvatar(userId, avatar);
        }

        uploadPromise.then(() => {
          this.onCompleted(userId);
        });
      })
      .catch((error) => {
        this.onError(error);
      });
  };

  public onCompleted = (userId: number) => {
    this.props.dispatch(addFlashMessage('Osoba byla úspěšně uložena.', 'success'));
    this.props.history.push(`/admin/users/edit/${userId}`);
  };

  public onError = (error: any) => {
    this.props.dispatch(addFlashMessage('Při ukládání došlo k chybě.', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  public render() {
    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <CreateUserMutationComponent mutation={CreateUser}>
          {(createUser) => (
            <UserForm
              onSubmit={this.onFormSubmit(createUser)}
              // submitting={submitting}
              title="Přidat nového člena týmu"
            />
          )}
        </CreateUserMutationComponent>
      </div>
    );
  }
}

export default connect()(withRouter(UserNew));
