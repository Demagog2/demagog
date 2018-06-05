import * as React from 'react';

import { Mutation, MutationFn } from 'react-apollo';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import { uploadBodyLogo } from '../api';
import { CreateBodyMutation, CreateBodyMutationVariables } from '../operation-result-types';
import { CreateBody } from '../queries/mutations';
import { BodyForm, IBodyFormData } from './forms/BodyForm';

class BodyNewMutation extends Mutation<CreateBodyMutation, CreateBodyMutationVariables> {}
interface ICreateBodyMutationFn
  extends MutationFn<CreateBodyMutation, CreateBodyMutationVariables> {}

interface IBodyNewProps extends RouteComponentProps<{}> {
  addFlashMessage: (msg: string) => void;
}

interface IBodyNewState {
  submitting: boolean;
}

// tslint:disable-next-line:max-classes-per-file
class BodyNew extends React.Component<IBodyNewProps, IBodyNewState> {
  public state = {
    submitting: false,
  };

  private onFormSubmit = (createBody: ICreateBodyMutationFn) => (bodyFormData: IBodyFormData) => {
    const { logo, ...bodyInput } = bodyFormData;

    this.setState({ submitting: true });

    createBody({ variables: { bodyInput } })
      .then((mutationResult) => {
        if (!mutationResult || !mutationResult.data || !mutationResult.data.createBody) {
          return;
        }

        const bodyId: number = parseInt(mutationResult.data.createBody.id, 10);

        let uploadPromise: Promise<any> = Promise.resolve();
        if (logo instanceof File) {
          uploadPromise = uploadBodyLogo(bodyId, logo);
        }

        uploadPromise.then(() => {
          this.setState({ submitting: false });
          this.onCompleted(bodyId);
        });
      })
      .catch((error) => {
        this.setState({ submitting: false });
        this.onError(error);
      });
  };

  private onCompleted = (bodyId: number) => {
    this.props.addFlashMessage('Strana / skupina byla úspěšně uložena.');
    this.props.history.push(`/admin/bodies/edit/${bodyId}`);
  };

  private onError = (error: any) => {
    this.props.addFlashMessage('Při ukládání došlo k chybě.');

    console.error(error); // tslint:disable-line:no-console
  };

  // tslint:disable-next-line:member-ordering
  public render() {
    const { submitting } = this.state;

    return (
      <div role="main">
        <h1>Přidat novou stranu / skupinu</h1>

        <BodyNewMutation mutation={CreateBody}>
          {(createBody) => (
            <BodyForm
              // onSubmit={(bodyInput) => createBody({ variables: { bodyInput } })}
              onSubmit={this.onFormSubmit(createBody)}
              submitting={submitting}
            />
          )}
        </BodyNewMutation>
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
)(withRouter(BodyNew));
