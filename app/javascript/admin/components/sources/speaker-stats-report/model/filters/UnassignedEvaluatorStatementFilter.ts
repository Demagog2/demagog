import { Statement } from '../Statement';
import { IStatementFilter } from './StatementFilter';

export class UnassignedEvaluatorStatementFilter implements IStatementFilter {
  public getKey() {
    return `unassigned-evaluator`;
  }

  public getLabel(statements: Statement[]): string {
    const count = this.apply(statements).length;

    return `Nepřiřazené (${count})`;
  }

  public apply(statements: Statement[]): Statement[] {
    return statements.filter((statement) => {
      return !statement.getEvaluator();
    });
  }
}
