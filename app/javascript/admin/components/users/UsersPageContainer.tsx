import React, { useState } from 'react';
import { useQuery } from 'react-apollo';

import { GetUsers } from '../../queries/queries';
import { GetUsers as GetUsersQuery, GetUsersVariables } from '../../operation-result-types';
import { UsersPage } from './UsersPage';

export function UsersPageContainer() {
  const [search, setSearch] = useState<string>('');
  const [includeInactive, setIncludeInactive] = useState<boolean>(false);
  const { data: users, loading, error } = useQuery<GetUsersQuery, GetUsersVariables>(GetUsers, {
    variables: {
      includeInactive,
      name: search,
    },
  });

  return (
    <UsersPage
      users={users}
      loading={loading}
      error={error}
      includeInactive={includeInactive}
      onIncludeInactiveChange={setIncludeInactive}
      search={search}
      onSearchChange={setSearch}
    />
  );
}
