import * as React from 'react';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { addFlashMessage } from '../../actions/flashMessages';
import { CreateSourceMutation, CreateSourceMutationVariables } from '../../operation-result-types';
import { CreateSource } from '../../queries/mutations';
import { SourceForm } from '../forms/SourceForm';

class CreateSourceMutationComponent extends Mutation<
  CreateSourceMutation,
  CreateSourceMutationVariables
> {}

interface ISourceNewProps extends RouteComponentProps<{}> {
  addFlashMessage: (msg: string) => void;
}

export class SourceNew extends React.Component<ISourceNewProps> {
  public onSuccess = (source: CreateSourceMutation) => {
    this.props.addFlashMessage('Zdroj výroků byl úspěšně uložen.');

    if (source.createSource) {
      this.props.history.push(`/admin/statements/sources/edit/${source.createSource.id}`);
    }
  };

  public onError = (error) => {
    this.props.addFlashMessage('Došlo k chybě při ukládání zdroje výroků');
    // tslint:disable-next-line:no-console
    console.error(error);
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
                onSubmit={(sourceInput) => createSource({ variables: { sourceInput } })}
                submitting={false}
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
