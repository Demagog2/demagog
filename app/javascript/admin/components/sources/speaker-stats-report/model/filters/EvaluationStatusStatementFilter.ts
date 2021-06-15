import { Statement } from '../Statement';
import { IStatementFilter } from './StatementFilter';
import {
  ASSESSMENT_STATUS_APPROVAL_NEEDED,
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_BEING_EVALUATED,
  ASSESSMENT_STATUS_PROOFREADING_NEEDED,
} from '../../../../../constants';

export const STATUS_FILTER_LABELS = {
  [ASSESSMENT_STATUS_BEING_EVALUATED]: 'Ve zpracování',
  [ASSESSMENT_STATUS_APPROVAL_NEEDED]: 'Ke kontrole',
  [ASSESSMENT_STATUS_PROOFREADING_NEEDED]: 'Ke korektuře',
  [ASSESSMENT_STATUS_APPROVED]: 'Schválené',
};

export class EvaluationStatusStatementFilter implements IStatementFilter {
  constructor(private evaluationStatus: string) {}

  public getKey() {
    return this.evaluationStatus;
  }

  public getLabel(statements: Statement[]): string {
    const count = this.apply(statements).length;

    return `${STATUS_FILTER_LABELS[this.evaluationStatus]} (${count})`;
  }

  public apply(statements: Statement[]): Statement[] {
    return statements.filter((statement) => statement.hasEvaluationStatus(this.evaluationStatus));
  }
}
