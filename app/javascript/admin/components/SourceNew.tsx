import * as React from 'react';
import { Mutation, MutationFn } from 'react-apollo';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { addFlashMessage } from '../actions/flashMessages';
import {
  CreateSourceMutation,
  CreateSourceMutationVariables,
  SourceInputType,
} from '../operation-result-types';
import { CreateSource } from '../queries/mutations';
import { SourceForm } from './forms/SourceForm';

class CreateSourceMutationComponent extends Mutation<
  CreateSourceMutation,
  CreateSourceMutationVariables
> {}

type CreateSourceMutationFn = MutationFn<CreateSourceMutation, CreateSourceMutationVariables>;

interface ISourceNewProps extends RouteComponentProps<{}> {
  addFlashMessage: (msg: string) => void;
}

interface ISourceNewState {
  submitting: boolean;
}

export class SourceNew extends React.Component<ISourceNewProps, ISourceNewState> {
  public state: ISourceNewState = {
    submitting: false,
  };

  public onSuccess = (source: CreateSourceMutation) => {
    this.props.addFlashMessage('Zdroj výroků byl úspěšně uložen.');

    if (source.createSource) {
      this.props.history.push(`/admin/sources/${source.createSource.id}`);
    }
  };

  public onError = (error) => {
    this.props.addFlashMessage('Došlo k chybě při ukládání zdroje výroků');
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
      <div role="main">
        <h1>Přidat nový zdroj</h1>

        <CreateSourceMutationComponent
          mutation={CreateSource}
          onCompleted={this.onSuccess}
          onError={this.onError}
        >
          {(createSource) => {
            return (
              <SourceForm
                backPath="/admin/sources"
                onSubmit={this.onSubmit(createSource)}
                submitting={this.state.submitting}
              />
            );
          }}
        </CreateSourceMutationComponent>
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
)(withRouter(SourceNew));
