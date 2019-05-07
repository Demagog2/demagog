import * as React from 'react';

import { Mutation, MutationFn } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { addFlashMessage } from '../../actions/flashMessages';
import {
  CreateMediumMutation,
  CreateMediumMutationVariables,
  MediumInput,
} from '../../operation-result-types';
import { CreateMedium } from '../../queries/mutations';
import { GetMedia, GetMediaPersonalitiesForSelect } from '../../queries/queries';
import { MediumForm } from '../forms/MediumForm';

class CreateMediumMutationComponent extends Mutation<
  CreateMediumMutation,
  CreateMediumMutationVariables
> {}

type CreateMediumMutationFn = MutationFn<CreateMediumMutation, CreateMediumMutationVariables>;

interface ISourceNewProps extends RouteComponentProps<{}>, DispatchProp {}

export class MediumNew extends React.Component<ISourceNewProps> {
  public onSuccess = (mediumId: string) => {
    this.props.dispatch(addFlashMessage('Pořad byl úspěšně uložen.', 'success'));

    this.props.history.push(`/admin/media/edit/${mediumId}`);
  };

  public onError = (error) => {
    this.props.dispatch(addFlashMessage('Došlo k chybě při ukládání pořadu.', 'error'));
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  public onSubmit = (createMedium: CreateMediumMutationFn) => (mediumInput: MediumInput) => {
    return createMedium({ variables: { mediumInput } })
      .then((mutationResult) => {
        if (!mutationResult || !mutationResult.data || !mutationResult.data.createMedium) {
          return;
        }

        const mediumId = mutationResult.data.createMedium.medium.id;

        this.onSuccess(mediumId);
      })
      .catch((error) => this.onError(error));
  };

  public render() {
    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <CreateMediumMutationComponent
          mutation={CreateMedium}
          // TODO: is there a nicer way of updating apollo cache after creating?
          refetchQueries={[
            { query: GetMedia, variables: { name: '' } },
            { query: GetMediaPersonalitiesForSelect },
          ]}
        >
          {(createMedium) => {
            return <MediumForm onSubmit={this.onSubmit(createMedium)} title="Přidat nový pořad" />;
          }}
        </CreateMediumMutationComponent>
      </div>
    );
  }
}

export default connect()(withRouter(MediumNew));
