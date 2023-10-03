import * as React from 'react';

import type { MutationFunction } from 'react-apollo';
import { Mutation, Query } from 'react-apollo';
import { useDispatch } from 'react-redux';

import { addFlashMessage } from '../../actions/flashMessages';
import type {
  GetPage as GetPageQuery,
  GetPageVariables as GetPageQueryVariables,
  PageInput,
  UpdatePage as UpdatePageMutation,
  UpdatePageVariables as UpdatePageMutationVariables,
} from '../../operation-result-types';
import { UpdatePage } from '../../queries/mutations';
import { GetPage, GetPages } from '../../queries/queries';
import { PageForm } from '../forms/PageForm';
import Loading from '../Loading';
import { useCallback } from 'react';
import { useParams } from 'react-router';

type UpdatePageMutationFn = MutationFunction<UpdatePageMutation, UpdatePageMutationVariables>;

export function PageEdit() {
  const dispatch = useDispatch();
  const params = useParams();

  const onSuccess = useCallback(() => {
    dispatch(addFlashMessage('Stránka byla úspěšně uložena.', 'success'));
  }, [dispatch]);

  const onError = useCallback(
    (error) => {
      dispatch(addFlashMessage('Došlo k chybě při ukládání stránky.', 'error'));
      console.error(error);
    },
    [dispatch],
  );

  const onSubmit = useCallback(
    (updatePage: UpdatePageMutationFn) => async(pageInput: PageInput) => {
      const id = params.id ?? '';

      await updatePage({ variables: { id, pageInput } })
        .then(() => { onSuccess(); })
        .catch((error) => { onError(error); });
    },
    [],
  );

  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      <Query<GetPageQuery, GetPageQueryVariables>
        query={GetPage}
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
            <Mutation<UpdatePageMutation, UpdatePageMutationVariables>
              mutation={UpdatePage}
              refetchQueries={[
                { query: GetPages, variables: { name: null } },
                { query: GetPage, variables: { id: params.id ?? '' } },
              ]}
            >
              {(updatePage) => {
                return (
                  <PageForm
                    page={data.page}
                    onSubmit={onSubmit(updatePage)}
                    title="Upravit stránku"
                    backPath="/admin/pages"
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
