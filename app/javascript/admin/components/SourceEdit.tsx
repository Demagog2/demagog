import * as React from 'react';
import { Mutation, Query, MutationFunction } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { addFlashMessage } from '../actions/flashMessages';
import {
  GetSource as GetSourceQuery,
  GetSourceVariables as GetSourceQueryVariables,
  SourceInput,
  UpdateSource as UpdateSourceMutation,
  UpdateSourceVariables as UpdateSourceMutationVariables,
} from '../operation-result-types';
import { UpdateSource } from '../queries/mutations';
import { GetSource, GetSources } from '../queries/queries';
import { SourceForm } from './forms/SourceForm';
import Loading from './Loading';

type UpdateSourceMutationFn = MutationFunction<UpdateSourceMutation, UpdateSourceMutationVariables>;

interface ISourceEditProps extends RouteComponentProps<{ id: string }>, DispatchProp {}

class SourceEdit extends React.Component<ISourceEditProps> {
  public onSuccess = () => {
    this.props.dispatch(addFlashMessage('Diskuze byla úspěšně uložena.', 'success'));
  };

  public onError = (error) => {
    this.props.dispatch(addFlashMessage('Došlo k chybě při ukládání diskuze', 'error'));
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  public onSubmit = (updateSource: UpdateSourceMutationFn) => (sourceInput: SourceInput) => {
    const id = this.getParamId();

    return updateSource({ variables: { id: id.toString(), sourceInput } });
  };

  public getParamId = () => parseInt(this.props.match.params.id, 10);

  public render() {
    const id = this.getParamId();

    return (
      <div role="main" style={{ marginTop: 15 }}>
        <Query<GetSourceQuery, GetSourceQueryVariables> query={GetSource} variables={{ id }}>
          {({ data, loading }) => {
            if (loading) {
              return <Loading />;
            }

            if (!data) {
              return null;
            }

            return (
              <Mutation<UpdateSourceMutation, UpdateSourceMutationVariables>
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
                      title="Upravit údaje o diskuzi"
                    />
                  );
                }}
              </Mutation>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default connect()(SourceEdit);
