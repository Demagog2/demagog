import type { SourceSpeaker } from '../model/SourceSpeaker';
import type { IStatsReport } from './model/StatsReport';
import type { Statement } from '../model/Statement';

export class SpeakerStatsReportBuilder {
  public static readonly BEING_EVALUATED_STATS_KEY = 'evaluated';

  constructor(protected sourceSpeaker: SourceSpeaker, protected statements: Statement[]) {}

  public buildReport(): IStatsReport {
    const DEFAULT_STATS_INDEX = this.getDefaultStatsIndex();

    const statsIndex = this.statements
      .filter((statement) => statement.belongsTo(this.sourceSpeaker))
      .reduce((stats, statement) => {
        const statsKey = this.statsKey(statement);

        return {
          ...stats,
          [statsKey]: stats[statsKey] + 1,
        };
      }, DEFAULT_STATS_INDEX);

    return {
      id: this.sourceSpeaker.getId(),
      title: this.sourceSpeaker.getFullName(),
      stats: Object.entries(statsIndex).map(([key, count]) => ({ key, count })),
    };
  }

  private getDefaultStatsIndex() {
    if (this.statements[0]?.getAssessmentMethodology() === 'promise_rating') {
      return {
        broken: 0,
        fulfilled: 0,
        in_progress: 0,
        partially_fulfilled: 0,
        stalled: 0,
        not_yet_evaluated: 0,
        [SpeakerStatsReportBuilder.BEING_EVALUATED_STATS_KEY]: 0,
      };
    }

    return {
      true: 0,
      untrue: 0,
      misleading: 0,
      unverifiable: 0,
      [SpeakerStatsReportBuilder.BEING_EVALUATED_STATS_KEY]: 0,
    };
  }

  private statsKey(statement: Statement): string {
    switch (statement.getAssessmentMethodology()) {
      case 'veracity':
        const veracity = statement.getVeracity();

        if (statement.isFinallyEvaluated() && veracity) {
          return veracity;
        }

        return SpeakerStatsReportBuilder.BEING_EVALUATED_STATS_KEY;

      case 'promise_rating':
        const promiseRating = statement.getPromiseRating();

        if (statement.isFinallyEvaluated() && promiseRating) {
          return promiseRating;
        }

        return SpeakerStatsReportBuilder.BEING_EVALUATED_STATS_KEY;
      default:
        return SpeakerStatsReportBuilder.BEING_EVALUATED_STATS_KEY;
    }
  }
}
