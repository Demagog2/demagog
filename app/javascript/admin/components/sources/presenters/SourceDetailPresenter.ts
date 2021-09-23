import { ISource } from '../model/Source';
import { IStatementFilter } from '../model/filters/StatementFilter';
import { IStatsReportViewModel } from '../speaker-stats-report/view/IStatsReportViewModel';
import { SpeakerStatsReportBuilder } from '../speaker-stats-report/SpeakerStatsReportBuilder';
import { StatsReportTranslator } from '../speaker-stats-report/translator/StatsReportTranslator';
import { Statement } from '../model/Statement';
import { FiltersViewModelBuilder, IFilterGroup, IFilterViewModel } from './FiltersViewModelBuilder';
import { FiltersFactory } from '../model/filters/FiltersFactory';

interface IStatementViewModel {
  id: string;
  content: string;
  published: boolean;
  sourceSpeaker: {
    firstName: string;
    lastName: string;
  };
  assessment: {
    evaluationStatus: string;
    evaluator: null | {
      firstName: string | null;
      lastName: string | null;
    };
    shortExplanationCharactersLength: number;
    explanationCharactersLength: number;
  };
  commentsCount: number;
}

export interface ISourceViewModel {
  id: string;
  name: string;
  sourceUrl?: string;
  releasedAt?: string;
  experts: string[];
  medium?: string;
  mediaPersonalities: string[];
  statementsTotalCount: number;
  hasActiveFilter: boolean;
  filteredStatements: IStatementViewModel[];
  filters: Array<IFilterGroup | IFilterViewModel>;
  speakerStats: IStatsReportViewModel[];
}

export class SourceDetailPresenter {
  constructor(private source: ISource, private activeFilterKeys: string[]) {
    this.filters = new FiltersFactory(this.source).createFilters();
  }

  private readonly filters: IStatementFilter[] = [];

  public buildViewModel(): ISourceViewModel {
    return {
      id: this.source.id,
      name: this.source.name,
      sourceUrl: this.source.sourceUrl ?? undefined,
      releasedAt: this.source.releasedAt ?? undefined,
      experts: this.buildExperts(),
      medium: this.source.medium?.name,
      mediaPersonalities: this.buildMediaPersonalities(),
      statementsTotalCount: this.source.statements.length,
      filteredStatements: this.buildStatementsViewModels(this.getFilteredStatements()),
      hasActiveFilter: this.activeFilterKeys.length > 0,
      filters: new FiltersViewModelBuilder(
        this.filters,
        this.activeFilterKeys,
        this.source.statements,
      ).buildViewModel(),
      speakerStats: this.buildSpeakerStats(),
    };
  }

  private getFilteredStatements(): Statement[] {
    if (this.activeFilterKeys.length) {
      const activeFilters = this.filters.filter((filter) =>
        this.activeFilterKeys.includes(filter.getKey()),
      );

      return activeFilters.reduce(
        (statements, filter) => filter.apply(statements),
        this.source.statements,
      );
    }

    return this.source.statements;
  }
  private buildStatementsViewModels(statements: Statement[]): IStatementViewModel[] {
    return statements.map((s) => {
      const evaluator = s.getEvaluator();

      return {
        id: s.getId(),
        published: s.isPublished(),
        content: s.getContent(),
        commentsCount: s.getCommentsCount(),
        assessment: {
          evaluator: evaluator
            ? {
                firstName: evaluator.getFirstName(),
                lastName: evaluator.getLastName(),
              }
            : null,
          evaluationStatus: s.getEvaluationStatus(),
          shortExplanationCharactersLength: s.getShortExplanationCharactersLength(),
          explanationCharactersLength: s.getExplanationCharactersLength(),
        },
        sourceSpeaker: {
          firstName: s.getSourceSpeaker().getFirstName(),
          lastName: s.getSourceSpeaker().getLastName(),
        },
      };
    });
  }

  private buildMediaPersonalities() {
    return this.source.mediaPersonalities.map((mediaPersonality) => mediaPersonality.getName());
  }

  private buildExperts() {
    return this.source.experts.map((expert) => expert.getFullName());
  }

  private buildSpeakerStats() {
    const statements = this.source.statements;

    return this.source.sourceSpeakers.map((sourceSpeaker) => {
      const report = new SpeakerStatsReportBuilder(sourceSpeaker, statements).buildReport();

      return {
        id: report.id,
        title: report.title,
        stats: report.stats.map(({ key, count }) =>
          new StatsReportTranslator().translate(key, count),
        ),
      };
    });
  }
}
