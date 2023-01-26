import { useQuery } from '@apollo/client';
import React, { useMemo } from 'react';
import * as ResultTypes from '../../operation-result-types';
import { GetTags } from '../../queries/queries';
import { Tags } from './Tags';

export function TagsContainer() {
  const { data, loading } = useQuery<ResultTypes.GetTags>(GetTags, {
    fetchPolicy: 'cache-and-network',
    variables: {},
  });

  const tags = useMemo(() => data?.tags ?? [], [data]);

  return <Tags loading={loading} tags={tags} />;
}
