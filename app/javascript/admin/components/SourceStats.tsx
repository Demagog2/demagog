import { useQuery } from '@apollo/client';
import { Classes } from '@blueprintjs/core';
import { css, cx } from 'emotion';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import * as ResultTypes from '../operation-result-types';
import { GetSource, GetSourceInternalStats } from '../queries/queries';
import Breadcrumbs from './Breadcrumbs';

const SourceStats = (props: RouteComponentProps<{ sourceId: string }>) => {
  const sourceId = parseInt(props.match.params.sourceId, 10);

  const { data: dataGetSource } = useQuery<ResultTypes.GetSource, ResultTypes.GetSourceVariables>(
    GetSource,
    {
      fetchPolicy: 'cache-and-network',
      variables: { id: sourceId },
    },
  );

  const { data: dataGetSourceInternalStats } = useQuery<
    ResultTypes.GetSourceInternalStats,
    ResultTypes.GetSourceInternalStatsVariables
  >(GetSourceInternalStats, {
    fetchPolicy: 'cache-and-network',
    variables: { id: sourceId },
  });

  if (!dataGetSource || !dataGetSourceInternalStats) {
    return null;
  }

  const source = dataGetSource.source;
  const internalStats = dataGetSourceInternalStats.source.internalStats;

  const breadcrumbs = [
    { href: '/admin/sources', text: 'Seznam diskuzí' },
    { href: `/admin/sources/${source.id}`, text: source.name },
    { text: 'Statistiky' },
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />
      <div
        className={css`
          margin-top: 20px;
        `}
      >
        <h3 className={Classes.HEADING}>Odkazy ze zveřejněných výroků</h3>

        <p>Celkem odkazů: {internalStats.all_links_count}</p>

        <h4>Po serverech</h4>

        <table
          className={cx(
            Classes.HTML_TABLE,
            Classes.HTML_TABLE_STRIPED,
            Classes.HTML_TABLE_CONDENSED,
          )}
        >
          <thead>
            <tr>
              <th>Server</th>
              <th>Počet použití</th>
            </tr>
          </thead>
          <tbody>
            {internalStats.grouped_by_host.map((item) => (
              <tr key={item.host}>
                <td>{item.host}</td>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h4>Všechny odkazy</h4>

        <table
          className={cx(
            Classes.HTML_TABLE,
            Classes.HTML_TABLE_STRIPED,
            Classes.HTML_TABLE_CONDENSED,
          )}
        >
          <thead>
            <tr>
              <th>Server</th>
              <th>Počet použití</th>
            </tr>
          </thead>
          <tbody>
            {internalStats.grouped_by_link.map((item) => (
              <tr key={item.link}>
                <td
                  className={css`
                    word-break: break-all;
                  `}
                >
                  {item.link}
                </td>
                <td>{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SourceStats;
