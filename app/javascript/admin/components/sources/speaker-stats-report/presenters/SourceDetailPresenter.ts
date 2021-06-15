import { Source } from '../../model/Source';
import { PublishedStateStatementFilter } from '../model/filters/PublishedStateStatementFilter';
import { IStatementFilter } from '../model/filters/StatementFilter';
import {
  EvaluationStatusStatementFilter,
  STATUS_FILTER_LABELS,
} from '../model/filters/EvaluationStatusStatementFilter';
import { UnpublishedVerifiedStatementFilter } from './UnpublishedVerifiedStatementFilter';
import { Evaluator } from '../model/Evaluator';
import { EvaluatorStatementFilter } from '../model/filters/EvaluatorStatementFilter';
import { UnassignedEvaluatorStatementFilter } from '../model/filters/UnassignedEvaluatorStatementFilter';

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

export interface ISourceViewModel {
  id: string;
  name: string;
  filters: Array<IFilterGroup | IFilterViewModel>;
}

export class SourceDetailPresenter {
  constructor(private source: Source, private activeFilterKeys: string[]) {}

  public buildViewModel(): ISourceViewModel {
    return {
      id: this.source.id,
      name: this.source.name,
      filters: [
        this.buildFilterGroup(
          'Filtrovat dle stavu',
          Object.keys(STATUS_FILTER_LABELS).map((key) => new EvaluationStatusStatementFilter(key)),
        ),
        this.buildFilterGroup('Filtrovat dle zveřejnění', [
          // TODO: Translations
          new PublishedStateStatementFilter('published'),
          new PublishedStateStatementFilter('unpublished'),
        ]),
        this.buildFilter(new UnpublishedVerifiedStatementFilter()),
        this.buildFilterGroup('Filtrovat dle ověřovatele', [
          // TODO: Sort by count and label, desc and asc
          ...this.getEvaluators().map((evaluator) => new EvaluatorStatementFilter(evaluator)),
          ...(this.source.statements.some((statement) => !statement.getEvaluator())
            ? [new UnassignedEvaluatorStatementFilter()]
            : []),
        ]),
      ],
    };
  }

  private buildFilters(filters: IStatementFilter[]): IFilterViewModel[] {
    return filters.map((filter) => this.buildFilter(filter));
  }

  private buildFilter(filter: IStatementFilter) {
    return {
      type: 'filter' as const,
      active: this.activeFilterKeys.includes(filter.getKey()),
      key: filter.getKey(),
      label: filter.getLabel(this.source.statements),
    };
  }

  private buildFilterGroup(label: string, filters: IStatementFilter[]): IFilterGroup {
    return {
      type: 'filter-group' as const,
      label,
      filters: this.buildFilters(filters),
    };
  }

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
}
