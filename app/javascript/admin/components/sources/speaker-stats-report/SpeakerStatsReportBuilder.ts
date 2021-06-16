import { Speaker } from '../model/Speaker';
import { IStatsReport } from './model/StatsReport';
import { Statement } from '../model/Statement';

export class SpeakerStatsReportBuilder {
  constructor(protected speaker: Speaker, protected statements: Statement[]) {}

  private BEING_EVALUATED_STATS_KEY = 'evaluated';

  public buildReport(): IStatsReport {
    const DEFAULT_STATS_INDEX = {
      true: 0,
      untrue: 0,
      misleading: 0,
      unverifiable: 0,
      [this.BEING_EVALUATED_STATS_KEY]: 0,
    };

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

  private statsKey(statement: Statement): string {
    const veracity = statement.getVeracity();

    if (statement.isFinallyEvaluated() && veracity) {
      return veracity;
    }

    return this.BEING_EVALUATED_STATS_KEY;
  }
}
