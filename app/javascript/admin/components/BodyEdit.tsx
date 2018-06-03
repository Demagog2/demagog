import * as React from 'react';
import { Mutation, MutationFn, Query } from 'react-apollo';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router';

import { addFlashMessage } from '../actions/flashMessages';
import { deleteBodyLogo, uploadBodyLogo } from '../api';
import {
  GetBodyQuery,
  UpdateBodyMutation,
  UpdateBodyMutationVariables,
} from '../operation-result-types';
import { UpdateBody } from '../queries/mutations';
import { GetBody } from '../queries/queries';
import Error from './Error';
import { BodyForm, IBodyFormData } from './forms/BodyForm';
import Loading from './Loading';

class UpdateBodyMutationComponent extends Mutation<
  UpdateBodyMutation,
  UpdateBodyMutationVariables
> {}
interface IUpdateBodyMutationFn
  extends MutationFn<UpdateBodyMutation, UpdateBodyMutationVariables> {}

interface IBodyDetailProps extends RouteComponentProps<{ id: string }> {
  addFlashMessage: (message: string) => void;
}

interface IBodyEditState {
  submitting: boolean;
}

class BodyEdit extends React.Component<IBodyDetailProps, IBodyEditState> {
  public state = {
    submitting: false,
  };

  private onFormSubmit = (
    id: number,
    updateBody: IUpdateBodyMutationFn,
    previousData: GetBodyQuery,
  ) => (speakerFormData: IBodyFormData) => {
    const { logo, ...bodyInput } = speakerFormData;

    this.setState({ submitting: true });

    // We want to first update the logo and then run mutation so the logo
    // gets automatically refreshed in Apollo's cache from the mutation result data
    let logoPromise: Promise<any> = Promise.resolve();
    if (logo instanceof File) {
      logoPromise = uploadBodyLogo(id, logo);
    } else if (logo === null && previousData.body.logo !== null) {
      logoPromise = deleteBodyLogo(id);
    }

    logoPromise
      .then(() => updateBody({ variables: { id, bodyInput } }))
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
        <h1>Upravit stranu / skupinu</h1>

        <Query query={GetBody} variables={{ id }}>
          {({ data, loading, error }) => {
            if (loading) {
              return <Loading />;
            }

            if (error) {
              return <Error error={error} />;
            }

            return (
              <UpdateBodyMutationComponent mutation={UpdateBody}>
                {(updateBody) => (
                  <BodyForm
                    bodyQuery={data}
                    onSubmit={this.onFormSubmit(id, updateBody, data)}
                    submitting={submitting}
                  />
                )}
              </UpdateBodyMutationComponent>
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

export default connect(null, mapDispatchToProps)(BodyEdit);
