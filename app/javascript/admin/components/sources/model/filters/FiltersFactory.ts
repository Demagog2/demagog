import {
  EvaluationStatusStatementFilter,
  STATUS_FILTER_LABELS,
} from './EvaluationStatusStatementFilter';
import { PublishedStateStatementFilter } from './PublishedStateStatementFilter';
import { UnpublishedVerifiedStatementFilter } from './UnpublishedVerifiedStatementFilter';
import { EvaluatorStatementFilter } from './EvaluatorStatementFilter';
import { UnassignedEvaluatorStatementFilter } from './UnassignedEvaluatorStatementFilter';
import type { ISource } from '../Source';
import type { Evaluator } from '../Evaluator';

export class FiltersFactory {
  constructor(private readonly source: ISource) {}

  public createFilters() {
    return [
      ...this.getEvaluationStatusStatementFilters(),
      ...this.getPublishedStateStatementFilters(),
      ...this.getEvaluatorStatementFilters(),
    ];
  }

  private getEvaluatorStatementFilters() {
    return [
      // TODO: Sort by count and label, desc and asc
      ...this.getEvaluators().map((evaluator) => new EvaluatorStatementFilter(evaluator)),
      ...(this.source.statements.some((statement) => !statement.getEvaluator())
        ? [new UnassignedEvaluatorStatementFilter()]
        : []),
    ];
  }

  private getPublishedStateStatementFilters() {
    return [
      new PublishedStateStatementFilter('published'),
      new PublishedStateStatementFilter('unpublished'),
      new UnpublishedVerifiedStatementFilter(),
    ];
  }

  private getEvaluationStatusStatementFilters() {
    return Object.keys(STATUS_FILTER_LABELS).map((key) => new EvaluationStatusStatementFilter(key));
  }

  private getEvaluators(): Evaluator[] {
    const evaluators = new Map<string, Evaluator>();
    for (const statement of this.source.statements) {
      const evaluator = statement.getEvaluator();
      if (evaluator) {
        evaluators.set(evaluator.getId(), evaluator);
      }
    }
    return Array.from(evaluators.values());
  }
}
