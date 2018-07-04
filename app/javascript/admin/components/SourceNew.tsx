import * as React from 'react';
import { Mutation, MutationFn } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { addFlashMessage } from '../actions/flashMessages';
import {
  CreateSourceMutation,
  CreateSourceMutationVariables,
  SourceInputType,
} from '../operation-result-types';
import { CreateSource } from '../queries/mutations';
import { GetSources } from '../queries/queries';
import { SourceForm } from './forms/SourceForm';

class CreateSourceMutationComponent extends Mutation<
  CreateSourceMutation,
  CreateSourceMutationVariables
> {}

type CreateSourceMutationFn = MutationFn<CreateSourceMutation, CreateSourceMutationVariables>;

interface ISourceNewProps extends RouteComponentProps<{}> {
  dispatch: Dispatch;
}

interface ISourceNewState {
  submitting: boolean;
}

export class SourceNew extends React.Component<ISourceNewProps, ISourceNewState> {
  public state: ISourceNewState = {
    submitting: false,
  };

  public onSuccess = (source: CreateSourceMutation) => {
    this.props.dispatch(addFlashMessage('Zdroj výroků byl úspěšně uložen.', 'success'));

    if (source.createSource) {
      this.props.history.push(`/admin/sources/${source.createSource.id}`);
    }
  };

  public onError = (error) => {
    this.props.dispatch(addFlashMessage('Došlo k chybě při ukládání zdroje výroků', 'error'));
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  public onSubmit = (createSource: CreateSourceMutationFn) => (sourceInput: SourceInputType) => {
    this.setState({ submitting: true });

    createSource({ variables: { sourceInput } }).finally(() => {
      this.setState({ submitting: false });
    });
  };

  public render() {
    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <CreateSourceMutationComponent
          mutation={CreateSource}
          onCompleted={this.onSuccess}
          onError={this.onError}
          refetchQueries={[{ query: GetSources, variables: { name: null } }]}
        >
          {(createSource) => {
            return (
              <SourceForm
                backPath="/admin/sources"
                onSubmit={this.onSubmit(createSource)}
                submitting={this.state.submitting}
                title="Přidat nový zdroj"
              />
            );
          }}
        </CreateSourceMutationComponent>
      </div>
    );
  }
}

export default connect()(withRouter(SourceNew));
