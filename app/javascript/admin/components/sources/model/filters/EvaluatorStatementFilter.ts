import type { Evaluator } from '../Evaluator';
import type { Statement } from '../Statement';
import type { IStatementFilter } from './StatementFilter';

export class EvaluatorStatementFilter implements IStatementFilter {
  constructor(private readonly evaluator: Evaluator) {}

  public getKey() {
    return `evaluator-${this.evaluator.getId()}`;
  }

  public getLabel(statements: Statement[]): string {
    const count = this.apply(statements).length;

    return `${this.evaluator.getFullName()} (${count})`;
  }

  public apply(statements: Statement[]): Statement[] {
    return statements.filter((statement) => {
      return statement.evaluatedBy(this.evaluator);
    });
  }

  public getGroupLabel(): string {
    return 'Filtrovat dle ověřovatele';
  }
}
