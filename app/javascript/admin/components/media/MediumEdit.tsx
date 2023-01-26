import * as React from 'react';
import { MutationFunction } from '@apollo/client';
import { Mutation, Query } from '@apollo/client/react/components';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { addFlashMessage } from '../../actions/flashMessages';
import {
  GetMedium as GetMediumQuery,
  GetMediumVariables as GetMediumQueryVariables,
  MediumInput,
  UpdateMedium as UpdateMediumMutation,
  UpdateMediumVariables as UpdateMediumMutationVariables,
} from '../../operation-result-types';
import { UpdateMedium } from '../../queries/mutations';
import { GetMedia, GetMediaPersonalitiesForSelect, GetMedium } from '../../queries/queries';
import { MediumForm } from '../forms/MediumForm';
import Loading from '../Loading';

type UpdateMediumMutationFn = MutationFunction<UpdateMediumMutation, UpdateMediumMutationVariables>;

interface IMediumEditProps extends RouteComponentProps<{ id: string }>, DispatchProp {}

class MediumEdit extends React.Component<IMediumEditProps> {
  public onSuccess = () => {
    this.props.dispatch(addFlashMessage('Pořad byl úspěšně uložen.', 'success'));
  };

  public onError = (error) => {
    this.props.dispatch(addFlashMessage('Došlo k chybě při ukládání pořadu.', 'error'));
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  public onSubmit = (updateMedium: UpdateMediumMutationFn) => (mediumInput: MediumInput) => {
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
        <Query<GetMediumQuery, GetMediumQueryVariables> query={GetMedium} variables={{ id }}>
          {({ data, loading }) => {
            if (loading) {
              return <Loading />;
            }

            if (!data) {
              return null;
            }

            return (
              <Mutation<UpdateMediumMutation, UpdateMediumMutationVariables>
                mutation={UpdateMedium}
                refetchQueries={[
                  { query: GetMedia, variables: { name: '' } },
                  { query: GetMedium, variables: { id } },
                  { query: GetMediaPersonalitiesForSelect },
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
              </Mutation>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default connect()(MediumEdit);
