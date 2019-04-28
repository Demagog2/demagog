import * as React from 'react';
import { Mutation, MutationFn } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { addFlashMessage } from '../actions/flashMessages';
import {
  CreateSourceMutation,
  CreateSourceMutationVariables,
  SourceInput,
} from '../operation-result-types';
import { CreateSource } from '../queries/mutations';
import { GetSources } from '../queries/queries';
import { SourceForm } from './forms/SourceForm';

class CreateSourceMutationComponent extends Mutation<
  CreateSourceMutation,
  CreateSourceMutationVariables
> {}

type CreateSourceMutationFn = MutationFn<CreateSourceMutation, CreateSourceMutationVariables>;

interface ISourceNewProps extends RouteComponentProps<{}>, DispatchProp {}

export class SourceNew extends React.Component<ISourceNewProps> {
  public onSuccess = (source: CreateSourceMutation) => {
    this.props.dispatch(addFlashMessage('Diskuze úspěšně uložena.', 'success'));

    if (source.createSource) {
      this.props.history.push(`/admin/sources/${source.createSource.source.id}`);
    }
  };

  public onError = (error) => {
    this.props.dispatch(addFlashMessage('Došlo k chybě při ukládání diskuze', 'error'));
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  public onSubmit = (createSource: CreateSourceMutationFn) => (sourceInput: SourceInput) => {
    return createSource({ variables: { sourceInput } });
  };

  public render() {
    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <CreateSourceMutationComponent
          mutation={CreateSource}
          onCompleted={this.onSuccess}
          onError={this.onError}
          refetchQueries={[{ query: GetSources, variables: { name: '', offset: 0, limit: 50 } }]}
        >
          {(createSource) => {
            return (
              <SourceForm
                backPath="/admin/sources"
                onSubmit={this.onSubmit(createSource)}
                title="Přidat novou diskuzi"
              />
            );
          }}
        </CreateSourceMutationComponent>
      </div>
    );
  }
}

export default connect()(withRouter(SourceNew));
