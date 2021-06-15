import React, { useMemo } from 'react';
import { SpeakerStatsReportBuilder } from './speaker-stats-report/SpeakerStatsReportBuilder';
import { SpeakersStats } from './speaker-stats-report/view/SpeakersStats';
import { StatsReportTranslator } from './speaker-stats-report/translator/StatsReportTranslator';

import { Source } from './model/Source';

export function SpeakerStatsContainer(props: { source: Source }) {
  const speakerStats = useMemo(() => {
    const statements = props.source.getStatements();

    return props.source.getSpeakers().map((speaker) => {
      const report = new SpeakerStatsReportBuilder(speaker, statements).buildReport();

      // build view model from report
      return {
        id: report.id,
        title: report.title,
        stats: report.stats.map(({ key, count }) =>
          new StatsReportTranslator().translate(key, count),
        ),
      };
    });
  }, [props.source]);

  return <SpeakersStats statsReports={speakerStats} />;
}
