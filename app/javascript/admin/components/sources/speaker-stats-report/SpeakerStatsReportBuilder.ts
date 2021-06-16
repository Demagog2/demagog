import { Speaker } from '../model/Speaker';
import { IStatsReport } from './model/StatsReport';
import { Statement } from '../model/Statement';

export class SpeakerStatsReportBuilder {
  constructor(protected speaker: Speaker, protected statements: Statement[]) {}

  private BEING_EVALUATED_STATS_KEY = 'evaluated';

  public buildReport(): IStatsReport {
    const DEFAULT_STATS_INDEX = this.getDefaultStatsIndex();

    const statsIndex = this.statements
      .filter((statement) => statement.belongsTo(this.speaker))
      .reduce((stats, statement) => {
        const statsKey = this.statsKey(statement);

        return {
          ...stats,
          [statsKey]: stats[statsKey] + 1,
        };
      }, DEFAULT_STATS_INDEX);

    return {
      id: this.speaker.getId(),
      title: this.speaker.getFullName(),
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
        [this.BEING_EVALUATED_STATS_KEY]: 0,
      };
    }

    return {
      true: 0,
      untrue: 0,
      misleading: 0,
      unverifiable: 0,
      [this.BEING_EVALUATED_STATS_KEY]: 0,
    };
  }

  private statsKey(statement: Statement): string {
    switch (statement.getAssessmentMethodology()) {
      case 'veracity':
        const veracity = statement.getVeracity();

        if (statement.isFinallyEvaluated() && veracity) {
          return veracity;
        }

        return this.BEING_EVALUATED_STATS_KEY;

      case 'promise_rating':
        const promiseRating = statement.getPromiseRating();

        if (statement.isFinallyEvaluated() && promiseRating) {
          return promiseRating;
        }

        return this.BEING_EVALUATED_STATS_KEY;
      default:
        return this.BEING_EVALUATED_STATS_KEY;
    }
  }
}
