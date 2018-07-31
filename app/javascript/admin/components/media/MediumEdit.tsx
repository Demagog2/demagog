import * as React from 'react';
import { Mutation, MutationFn, Query } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { addFlashMessage } from '../../actions/flashMessages';
import {
  GetMediumQuery,
  GetMediumQueryVariables,
  MediumInputType,
  UpdateMediumMutation,
  UpdateMediumMutationVariables,
} from '../../operation-result-types';
import { UpdateMedium } from '../../queries/mutations';
import { GetMedia, GetMedium } from '../../queries/queries';
import { MediumForm } from '../forms/MediumForm';
import Loading from '../Loading';

class MediumQuery extends Query<GetMediumQuery, GetMediumQueryVariables> {}
class UpdateMediumMutationComponent extends Mutation<
  UpdateMediumMutation,
  UpdateMediumMutationVariables
> {}

type UpdateMediumMutationFn = MutationFn<UpdateMediumMutation, UpdateMediumMutationVariables>;

interface IMediumEditProps extends RouteComponentProps<{ id: string }> {
  dispatch: Dispatch;
}

class MediumEdit extends React.Component<IMediumEditProps> {
  public onSuccess = () => {
    this.props.dispatch(addFlashMessage('Pořad byl úspěšně uložen.', 'success'));
  };

  public onError = (error) => {
    this.props.dispatch(addFlashMessage('Došlo k chybě při ukládání pořadu.', 'error'));
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  public onSubmit = (updateMedium: UpdateMediumMutationFn) => (mediumInput: MediumInputType) => {
    const id = this.getParamId();

    return updateMedium({ variables: { id, mediumInput } })
      .then(() => this.onSuccess())
      .catch((error) => this.onError(error));
  };

  public getParamId = () => this.props.match.params.id;

  public render() {
    const id = this.getParamId();

    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <MediumQuery query={GetMedium} variables={{ id }}>
          {({ data, loading }) => {
            if (loading) {
              return <Loading />;
            }

            if (!data) {
              return null;
            }

            return (
              <UpdateMediumMutationComponent
                mutation={UpdateMedium}
                refetchQueries={[
                  { query: GetMedia, variables: { name: null } },
                  { query: GetMedium, variables: { id } },
                ]}
              >
                {(updateMedium) => {
                  return (
                    <MediumForm
                      medium={data.medium}
                      onSubmit={this.onSubmit(updateMedium)}
                      title="Upravit pořad"
                    />
                  );
                }}
              </UpdateMediumMutationComponent>
            );
          }}
        </MediumQuery>
      </div>
    );
  }
}

export default connect()(MediumEdit);
