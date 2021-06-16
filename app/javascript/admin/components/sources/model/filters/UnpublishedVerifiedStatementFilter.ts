import { IStatementFilter } from './StatementFilter';
import { Statement } from '../Statement';
import { ASSESSMENT_STATUS_APPROVED } from '../../../../constants';

export class UnpublishedVerifiedStatementFilter implements IStatementFilter {
  public getKey() {
    return 'unpublished-and-verified';
  }

  public getLabel(statements: Statement[]): string {
    const count = this.apply(statements).length;

    return `Nezveřejněné, schválené (${count})`;
  }

  public apply(statements: Statement[]): Statement[] {
    return statements.filter(
      (statement) =>
        statement.hasEvaluationStatus(ASSESSMENT_STATUS_APPROVED) && !statement.isPublished(),
    );
  }
}
