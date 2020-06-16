import { useQuery } from 'react-apollo';

import { GetTags } from './queries/queries';
import * as ResultTypes from './operation-result-types';

export const useTags = () => {
  const { data, loading } = useQuery<ResultTypes.GetTags>(GetTags, {
    fetchPolicy: 'cache-and-network',
    variables: {},
  });

  return {
    tags: data ? data.tags : null,
    loading,
  };
};
