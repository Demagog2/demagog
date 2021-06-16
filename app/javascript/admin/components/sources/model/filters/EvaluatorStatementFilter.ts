import { Evaluator } from '../Evaluator';
import { Statement } from '../Statement';
import { IStatementFilter } from './StatementFilter';

export class EvaluatorStatementFilter implements IStatementFilter {
  constructor(private evaluator: Evaluator) {}

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
