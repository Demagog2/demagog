import { Classes } from '@blueprintjs/core';
import { css, cx } from 'emotion';
import * as React from 'react';
import { useQuery } from 'react-apollo';
import { useDispatch } from 'react-redux';

import { addFlashMessage } from '../actions/flashMessages';
import { mailFactualStatementsExport } from '../api';
import * as ResultTypes from '../operation-result-types';
import { GetInternalOverallStats } from '../queries/queries';
import Breadcrumbs from './Breadcrumbs';

const OverallStats = () => {
  const dispatch = useDispatch();

  const { data: dataGetInternalOverallStats } = useQuery<ResultTypes.GetInternalOverallStats>(
    GetInternalOverallStats,
    {
      fetchPolicy: 'cache-and-network',
    },
  );

  const onExportStatements = React.useCallback(() => {
    mailFactualStatementsExport().then(() => {
      dispatch(
        addFlashMessage(
          'Export se zpracovává, do minuty by ti jej měl systém poslat mailem.',
          'success',
        ),
      );
    });
  }, [dispatch]);

  const breadcrumbs = [{ text: 'Statistiky' }];

  if (!dataGetInternalOverallStats) {
    return null;
  }

  const {
    factualAndPublishedStatementsCount,
    speakersWithFactualAndPublishedStatementsCount,
  } = dataGetInternalOverallStats.internalOverallStats;

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      <div
        className={css`
          margin-top: 20px;
        `}
      >
        <h3 className={Classes.HEADING}>Zveřejněné výroky</h3>

        <p>Celkem: {factualAndPublishedStatementsCount}</p>

        <p>
          <button type="button" className={Classes.BUTTON} onClick={onExportStatements}>
            Export všech výroků do Excelu
          </button>
        </p>

        <h3
          className={cx(
            Classes.HEADING,
            css`
              margin-top: 20px;
            `,
          )}
        >
          Ověření řečníci
        </h3>

        <p>Celkem: {speakersWithFactualAndPublishedStatementsCount}</p>

        <p>
          <a href="/admin/export/speakers.xlsx" className={Classes.BUTTON}>
            Export řečníků s počty výroků do Excelu
          </a>
        </p>
      </div>
    </>
  );
};

export default OverallStats;
