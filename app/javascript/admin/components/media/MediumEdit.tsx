import * as React from 'react';
import { Mutation, Query, MutationFunction } from 'react-apollo';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
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

export function MediumEdit() {
  const params = useParams();
  const dispatch = useDispatch();

  const onSuccess = () => {
    dispatch(addFlashMessage('Pořad byl úspěšně uložen.', 'success'));
  };

  const onError = (error) => {
    dispatch(addFlashMessage('Došlo k chybě při ukládání pořadu.', 'error'));
    // tslint:disable-next-line:no-console
    console.error(error);
  };

  const onSubmit = (updateMedium: UpdateMediumMutationFn) => (mediumInput: MediumInput) => {
    return updateMedium({ variables: { id: params.id ?? '', mediumInput } })
      .then(() => onSuccess())
      .catch((error) => onError(error));
  };

  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      <Query<GetMediumQuery, GetMediumQueryVariables>
        query={GetMedium}
        variables={{ id: params.id ?? '' }}
      >
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
                { query: GetMedium, variables: { id: params.id ?? '' } },
                { query: GetMediaPersonalitiesForSelect },
              ]}
            >
              {(updateMedium) => {
                return (
                  <MediumForm
                    medium={data.medium}
                    onSubmit={onSubmit(updateMedium)}
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
