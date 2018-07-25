import * as React from 'react';
import { Mutation, MutationFn, Query } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
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
import Loading from './Loading';

class SourceQuery extends Query<GetSourceQuery, GetSourceQueryVariables> {}
class UpdateSourceMutationComponent extends Mutation<
  UpdateSourceMutation,
  UpdateSourceMutationVariables
> {}

type UpdateSourceMutationFn = MutationFn<UpdateSourceMutation, UpdateSourceMutationVariables>;

interface ISourceEditProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
}

class SourceEdit extends React.Component<ISourceEditProps> {
  public onSuccess = () => {
    this.props.dispatch(addFlashMessage('Zdroj výroků byl úspěšně uložen.', 'success'));
  };

  public onError = (error) => {
    this.props.dispatch(addFlashMessage('Došlo k chybě při ukládání zdroje výroků', 'error'));
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  public onSubmit = (updateSource: UpdateSourceMutationFn) => (sourceInput: SourceInputType) => {
    const id = this.getParamId();

    return updateSource({ variables: { id, sourceInput } });
  };

  public getParamId = () => parseInt(this.props.match.params.id, 10);

  public render() {
    const id = this.getParamId();

    return (
      <div role="main" style={{ marginTop: 15 }}>
        <SourceQuery query={GetSource} variables={{ id }}>
          {({ data, loading }) => {
            if (loading) {
              return <Loading />;
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
                  { query: GetSources, variables: { name: '', offset: 0, limit: 50 } },
                  { query: GetSource, variables: { id } },
                ]}
              >
                {(updateSource) => {
                  return (
                    <SourceForm
                      backPath={`/admin/sources/${data.source.id}`}
                      source={data.source}
                      onSubmit={this.onSubmit(updateSource)}
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

export default connect()(SourceEdit);
