import React from 'react';
import { css } from 'emotion';
import { Colors } from '@blueprintjs/core';
import { StatsReportViewModel } from './StatsReportViewModel';

export function SpeakersStats(props: { statsReports: StatsReportViewModel[] }) {
  return (
    <div
      className={css`
        background-color: ${Colors.LIGHT_GRAY5};
        padding: 15px 15px 5px 15px;
        margin-top: 20px;
      `}
    >
      {props.statsReports.map((report) => (
        <p key={report.id}>
          <strong>{report.title}</strong>

          <br />
          {report.stats.map((stat, index) => (
            <React.Fragment key={index}>
              {stat}
              <br />
            </React.Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}
