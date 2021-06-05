import * as React from 'react';

import { sortBy } from 'lodash';
import { useQuery, useMutation } from 'react-apollo';
import { captureException } from '@sentry/browser';
import {
  GetUsers as GetUsersQuery,
  GetUsersVariables,
  UpdateUsersRank as UpdateUsersRankMutation,
  UpdateUsersRankVariables as UpdateUsersRankMutationVariables,
} from '../../operation-result-types';
import { UpdateUsersRank } from '../../queries/mutations';
import { GetUsers } from '../../queries/queries';
import { useFlashMessage } from '../../hooks/use-flash-messages';
import { UsersSortOnAboutUsPage } from './UsersSortOnAboutUsPage';

export function UsersSortOnAboutUsPageContainer() {
  const addFlashMessage = useFlashMessage();
  const { data, loading } = useQuery<GetUsersQuery, GetUsersVariables>(GetUsers);

  const [mutate, { loading: saving }] = useMutation<
    UpdateUsersRankMutation,
    UpdateUsersRankMutationVariables
  >(UpdateUsersRank, {
    onCompleted() {
      addFlashMessage('Řazení členů týmu na stránce „O nás“ úspěšně uloženo.', 'success');
    },

    onError(error) {
      addFlashMessage('Při ukládání došlo k chybě.', 'error');
      captureException(error);
    },
  });

  return (
    <UsersSortOnAboutUsPage
      isLoading={loading}
      isSaving={saving}
      users={sortBy(data?.users.filter((u) => u.userPublic) ?? [], 'rank')}
      onSave={(users) => mutate({ variables: { orderedUserIds: users.map((user) => user.id) } })}
    />
  );
}
