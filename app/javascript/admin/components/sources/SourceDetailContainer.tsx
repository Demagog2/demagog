import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import {
  GetSourceDetail as GetSourceDetailQuery,
  GetSourceDetailVariables,
} from '../../operation-result-types';
import { GetSourceDetail } from '../../queries/queries';
import { useRouteMatch } from 'react-router';
import { MassStatementsPublishModalContainer } from './MassStatementsPublishModalContainer';
import { useModal } from 'react-modal-hook';
import { RemoveSourceModalContainer } from './RemoveSourceModalContainer';
import { useStatementFilters } from './hooks/statement-filters';
import { SourceDetail } from './SourceDetail';
import { createSourceFromQuery } from './data-mappers/SourceDataMapper';
import { EMPTY_SOURCE, ISource } from './model/Source';
import { SourceDetailPresenter } from './presenters/SourceDetailPresenter';
import { ASSESSMENT_STATUS_APPROVED } from '../../constants';

export function SourceDetailContainer() {
  const { params } = useRouteMatch<{ sourceId: string }>();
  const { state, onStatementsFilterUpdate, onRemoveStatementsFilters } = useStatementFilters();

  const { data, loading } = useQuery<GetSourceDetailQuery, GetSourceDetailVariables>(
    GetSourceDetail,
    {
      variables: {
        id: parseInt(params.sourceId, 10),
      },
    },
  );

  const source = useMemo<ISource>(() => (data ? createSourceFromQuery(data) : EMPTY_SOURCE), [
    data,
  ]);

  const sourceViewModel = new SourceDetailPresenter(source, state ? [state] : []).buildViewModel();

  const [showMassStatementsPublishModal, closeMassStatementsPublishModal] = useModal(
    () => (
      <MassStatementsPublishModalContainer
        sourceId={source.id}
        readyToPublishStatementsCount={
          source.statements.filter(
            (s) => s.hasEvaluationStatus(ASSESSMENT_STATUS_APPROVED) && !s.isPublished(),
          ).length
        }
        onClose={closeMassStatementsPublishModal}
      />
    ),
    [source],
  );

  const [showRemoveSourceModal, closeRemoveSourceModal] = useModal(
    () => (
      <RemoveSourceModalContainer
        sourceId={source.id}
        sourceName={source.name}
        onClose={closeRemoveSourceModal}
      />
    ),
    [source],
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
