import React, { useMemo } from 'react';
import { useQuery } from 'react-apollo';
import type * as ResultTypes from '../../operation-result-types';
import { GetArticleTags } from '../../queries/queries';
import { ArticleTags } from './ArticleTags';

export function ArticleTagsContainer() {
  const { data, loading } = useQuery<ResultTypes.GetArticleTags>(GetArticleTags, {
    fetchPolicy: 'cache-and-network',
    variables: {},
  });

  const articleTags = useMemo(() => data?.articleTags ?? [], [data]);
  return <ArticleTags loading={loading} tags={articleTags} />;
}
