import * as React from 'react';
import { Mutation, MutationFn, Query } from 'react-apollo';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { addFlashMessage } from '../actions/flashMessages';
import {
  GetSourceQuery,
  GetSourceQueryVariables,
  SourceInputType,
  UpdateSourceMutation,
  UpdateSourceMutationVariables,
} from '../operation-result-types';
import { UpdateSource } from '../queries/mutations';
import { GetSource, GetSources } from '../queries/queries';
import { SourceForm } from './forms/SourceForm';

class SourceQuery extends Query<GetSourceQuery, GetSourceQueryVariables> {}
class UpdateSourceMutationComponent extends Mutation<
  UpdateSourceMutation,
  UpdateSourceMutationVariables
> {}

type UpdateSourceMutationFn = MutationFn<UpdateSourceMutation, UpdateSourceMutationVariables>;

interface ISourceEditProps extends RouteComponentProps<{ id: string }> {
  addFlashMessage: (message: string) => void;
}

interface ISourceEditState {
  submitting: boolean;
}

class SourceEdit extends React.Component<ISourceEditProps, ISourceEditState> {
  public state: ISourceEditState = {
    submitting: false,
  };

  public onSuccess = () => {
    this.props.addFlashMessage('Zdroj výroků byl úspěšně uložen.');
  };

  public onError = (error) => {
    this.props.addFlashMessage('Došlo k chybě při ukládání zdroje výroků');
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  public onSubmit = (updateSource: UpdateSourceMutationFn) => (sourceInput: SourceInputType) => {
    const id = this.getParamId();

    this.setState({ submitting: true });

    updateSource({ variables: { id, sourceInput } }).finally(() => {
      this.setState({ submitting: false });
    });
  };

  public getParamId = () => parseInt(this.props.match.params.id, 10);

  public render() {
    const id = this.getParamId();

    return (
      <div role="main" style={{ marginTop: 15 }}>
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
                refetchQueries={[
                  { query: GetSources, variables: { name: null } },
                  { query: GetSource, variables: { id } },
                ]}
              >
                {(updateSource) => {
                  return (
                    <SourceForm
                      backPath={`/admin/sources/${data.source.id}`}
                      sourceQuery={data}
                      onSubmit={this.onSubmit(updateSource)}
                      submitting={this.state.submitting}
                      title="Upravit zdroj"
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
