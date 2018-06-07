import * as React from 'react';
import { Mutation, Query } from 'react-apollo';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { addFlashMessage } from '../../actions/flashMessages';
import {
  GetSourceQuery,
  GetSourceQueryVariables,
  UpdateSourceMutation,
  UpdateSourceMutationVariables,
} from '../../operation-result-types';
import { UpdateSource } from '../../queries/mutations';
import { GetSource } from '../../queries/queries';
import { SourceForm } from '../forms/SourceForm';

class SourceQuery extends Query<GetSourceQuery, GetSourceQueryVariables> {}
class UpdateSourceMutationComponent extends Mutation<
  UpdateSourceMutation,
  UpdateSourceMutationVariables
> {}

interface ISourceEditProps extends RouteComponentProps<{ id: string }> {
  addFlashMessage: (message: string) => void;
}

class SourceEdit extends React.Component<ISourceEditProps> {
  public onSuccess = () => {
    this.props.addFlashMessage('Zdroj výroků byl úspěšně uložen.');
  };

  public onError = (error) => {
    this.props.addFlashMessage('Došlo k chybě při ukládání zdroje výroků');
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  public render() {
    const id = parseInt(this.props.match.params.id, 10);

    return (
      <div role="main">
        <h1>Upravit zdroj</h1>

        <SourceQuery query={GetSource} variables={{ id }}>
          {({ data, loading }) => {
            if (loading) {
              return 'Loading...';
            }

            if (!data) {
              return null;
            }

            return (
              <UpdateSourceMutationComponent
                mutation={UpdateSource}
                onCompleted={this.onSuccess}
                onError={this.onError}
              >
                {(updateSource) => {
                  return (
                    <SourceForm
                      sourceQuery={data}
                      onSubmit={(sourceInput) => updateSource({ variables: { id, sourceInput } })}
                      submitting={false}
                    />
                  );
                }}
              </UpdateSourceMutationComponent>
            );
          }}
        </SourceQuery>
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
)(SourceEdit);
