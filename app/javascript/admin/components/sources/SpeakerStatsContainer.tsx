import React, { useMemo } from 'react';
import { SpeakerStatsReportBuilder } from './speaker-stats-report/SpeakerStatsReportBuilder';
import {
  GetSource_source_speakers,
  GetSourceStatements as GetSourceStatementsQuery,
} from '../../operation-result-types';
import { SpeakersStats } from './speaker-stats-report/view/SpeakersStats';
import { StatsReportTranslator } from './speaker-stats-report/translator/StatsReportTranslator';
import { createSpeakerFromQuery } from './speaker-stats-report/data-mappers/SpeakerDataMapper';
import { createStatementFromQuery } from './speaker-stats-report/data-mappers/StatementDataMapper';

export function SpeakerStatsContainer(props: {
  speakers: GetSource_source_speakers[];
  statements: GetSourceStatementsQuery['statements'];
}) {
  const speakerStats = useMemo(() => {
    const statements = props.statements.map((queryStatement) =>
      createStatementFromQuery(queryStatement),
    );

    return props.speakers.map((speaker) => {
      const report = new SpeakerStatsReportBuilder(
        createSpeakerFromQuery(speaker),
        statements,
      ).buildReport();

      // build view model from report
      return {
        id: report.id,
        title: report.title,
        stats: report.stats.map(({ key, count }) =>
          new StatsReportTranslator().translate(key, count),
        ),
      };
    });
  }, [props.speakers, props.statements]);

  return <SpeakersStats statsReports={speakerStats} />;
}
