import React, { useMemo } from 'react';
import {
  GetSourceDetail as GetSourceDetailQuery,
  GetSourceDetailVariables,
} from '../../operation-result-types';
import { GetSourceDetail } from '../../queries/queries';
import { useQuery } from 'react-apollo';
import { useRouteMatch } from 'react-router';
import { MassStatementsPublishModalContainer } from './MassStatementsPublishModalContainer';
import { useModal } from 'react-modal-hook';
import { RemoveSourceModalContainer } from './RemoveSourceModalContainer';
import { useStatementFilters } from './hooks/statement-filters';
import { SourceDetail } from './SourceDetail';
import { createSourceFromQuery } from './data-mappers/SourceDataMapper';
import { Source } from './model/Source';
import { SourceDetailPresenter } from './speaker-stats-report/presenters/SourceDetailPresenter';

export function SourceDetailContainer() {
  const { params } = useRouteMatch<{ sourceId: string }>();
  const { onStatementsFilterUpdate, onRemoveStatementsFilters } = useStatementFilters();
  const { data, loading } = useQuery<GetSourceDetailQuery, GetSourceDetailVariables>(
    GetSourceDetail,
    {
      variables: {
        id: parseInt(params.sourceId, 10),
      },
    },
  );

  const source = useMemo(() => {
    return data ? createSourceFromQuery(data) : new Source('', 'Empty source', [], [], [], null);
  }, [data]);

  // TODO: Pass in real active filters
  const sourceViewModel = new SourceDetailPresenter(source, []).buildViewModel();

  const [showMassStatementsPublishModal, closeMassStatementsPublishModal] = useModal(
    () => (
      <MassStatementsPublishModalContainer
        sourceId={source.id}
        readyToPublishStatementsCount={0}
        onClose={closeMassStatementsPublishModal}
      />
    ),
    [data?.source],
  );

  const [showRemoveSourceModal, closeRemoveSourceModal] = useModal(
    () => (
      <RemoveSourceModalContainer
        sourceId={source.id}
        sourceName={source.name}
        onClose={closeRemoveSourceModal}
      />
    ),
    [data?.source],
  );

  return (
    <SourceDetail
      source={sourceViewModel}
      loading={loading}
      onMassStatementsPublish={showMassStatementsPublishModal}
      onDeleteSource={showRemoveSourceModal}
      onStatementFiltersUpdate={onStatementsFilterUpdate}
      onRemoveStatementsFilter={onRemoveStatementsFilters}
    />
  );
}
