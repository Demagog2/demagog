import { Classes } from '@blueprintjs/core';
import { css, cx } from 'emotion';
import * as React from 'react';
import { useQuery } from 'react-apollo';
import { useDispatch, useSelector } from 'react-redux';

import { addFlashMessage } from '../actions/flashMessages';
import { mailFactualStatementsExport } from '../api';
import type * as ResultTypes from '../operation-result-types';
import { GetInternalOverallStats } from '../queries/queries';
import type { IState as ReduxState } from '../reducers';
import Breadcrumbs from './Breadcrumbs';

const OverallStats = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: ReduxState) => state.currentUser.user);

  const { data: dataGetInternalOverallStats } = useQuery<ResultTypes.GetInternalOverallStats>(
    GetInternalOverallStats,
    {
      fetchPolicy: 'cache-and-network',
    },
  );

  const onExportStatements = React.useCallback(() => {
    mailFactualStatementsExport().then(() => {
      const email = currentUser ? currentUser.email : null;
      dispatch(
        addFlashMessage(
          `Export se zpracovává, do pár minut by ti jej měl systém poslat mailem na ${email}`,
          'success',
        ),
      );
    });
  }, [currentUser, dispatch]);

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

        <h3
          className={cx(
            Classes.HEADING,
            css`
              margin-top: 20px;
            `,
          )}
        >
          Délka ověřování
        </h3>

        <p>
          <a href="/admin/export/statements-evaluation-process.xlsx" className={Classes.BUTTON}>
            Export výroků se statistikami o délce ověřování
          </a>
        </p>
      </div>
    </>
  );
};

export default OverallStats;
