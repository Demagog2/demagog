import { Source } from '../model/Source';
import { PublishedStateStatementFilter } from '../model/filters/PublishedStateStatementFilter';
import { IStatementFilter } from '../model/filters/StatementFilter';
import {
  EvaluationStatusStatementFilter,
  STATUS_FILTER_LABELS,
} from '../model/filters/EvaluationStatusStatementFilter';
import { UnpublishedVerifiedStatementFilter } from '../model/filters/UnpublishedVerifiedStatementFilter';
import { Evaluator } from '../model/Evaluator';
import { EvaluatorStatementFilter } from '../model/filters/EvaluatorStatementFilter';
import { UnassignedEvaluatorStatementFilter } from '../model/filters/UnassignedEvaluatorStatementFilter';
import { StatsReportViewModel } from '../speaker-stats-report/view/StatsReportViewModel';
import { SpeakerStatsReportBuilder } from '../speaker-stats-report/SpeakerStatsReportBuilder';
import { StatsReportTranslator } from '../speaker-stats-report/translator/StatsReportTranslator';
import { Statement } from '../model/Statement';

interface IFilterGroup {
  type: 'filter-group';
  label: string;
  filters: IFilterViewModel[];
}

interface IFilterViewModel {
  type: 'filter';
  key: string;
  label: string;
  active: boolean;
}

interface IStatementViewModel {
  id: string;
  content: string;
  published: boolean;
  speaker: {
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
  speakerStats: StatsReportViewModel[];
}

export class SourceDetailPresenter {
  constructor(private source: Source, private activeFilterKeys: string[]) {
    this.filters = this.createFilters();
  }

  private filters: IStatementFilter[] = [];

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
      filters: this.buildFiltersViewModel(),
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

  private createFilters(): IStatementFilter[] {
    return [
      ...Object.keys(STATUS_FILTER_LABELS).map((key) => new EvaluationStatusStatementFilter(key)),
      // TODO: Translations
      new PublishedStateStatementFilter('published'),
      new PublishedStateStatementFilter('unpublished'),
      new UnpublishedVerifiedStatementFilter(),
      ...[
        // TODO: Sort by count and label, desc and asc
        ...this.getEvaluators().map((evaluator) => new EvaluatorStatementFilter(evaluator)),
        ...(this.source.statements.some((statement) => !statement.getEvaluator())
          ? [new UnassignedEvaluatorStatementFilter()]
          : []),
      ],
    ];
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
        speaker: {
          firstName: s.getSpeaker().getFirstName(),
          lastName: s.getSpeaker().getLastName(),
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

    return this.source.speakers.map((speaker) => {
      const report = new SpeakerStatsReportBuilder(speaker, statements).buildReport();

      return {
        id: report.id,
        title: report.title,
        stats: report.stats.map(({ key, count }) =>
          new StatsReportTranslator().translate(key, count),
        ),
      };
    });
  }

  // private buildFilters(filters: IStatementFilter[]): IFilterViewModel[] {
  //   return filters.map((filter) => this.buildFilter(filter));
  // }

  private buildFilter(filter: IStatementFilter) {
    return {
      type: 'filter' as const,
      active: this.activeFilterKeys.includes(filter.getKey()),
      key: filter.getKey(),
      label: filter.getLabel(this.source.statements),
    };
  }

  // private buildFilterGroup(label: string, filters: IStatementFilter[]): IFilterGroup {
  //   return {
  //     type: 'filter-group' as const,
  //     label,
  //     filters: this.buildFilters(filters),
  //   };
  // }

  private getEvaluators(): Evaluator[] {
    const evaluators: Map<string, Evaluator> = new Map();
    for (const statement of this.source.statements) {
      const evaluator = statement.getEvaluator();
      if (evaluator) {
        evaluators.set(evaluator.getId(), evaluator);
      }
    }
    return Array.from(evaluators.values());
  }

  private buildFiltersViewModel() {
    const groups: Array<IFilterViewModel | IFilterGroup> = [];

    for (const filter of this.filters) {
      const groupLabel = filter.getGroupLabel?.();

      if (!groupLabel) {
        groups.push(this.buildFilter(filter));
      } else {
        const group = groups.find((g) => g.type === 'filter-group' && g.label === groupLabel) as
          | IFilterGroup
          | undefined;

        if (group) {
          group.filters.push(this.buildFilter(filter));
        } else {
          groups.push({
            type: 'filter-group',
            label: groupLabel,
            filters: [this.buildFilter(filter)],
          });
        }
      }
    }

    return groups;
  }
}
