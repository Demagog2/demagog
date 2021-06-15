import { Statement } from '../Statement';
import { IStatementFilter } from './StatementFilter';

export class PublishedStateStatementFilter implements IStatementFilter {
  constructor(private state: 'published' | 'unpublished') {}

  public getKey() {
    return this.state;
  }

  public getLabel(statements: Statement[]): string {
    const count = this.apply(statements).length;

    return this.state === 'published' ? `Published (${count})` : `Unpublished (${count})`;
  }

  public apply(statements: Statement[]): Statement[] {
    return statements.filter((statement) =>
      this.state === 'published' ? statement.isPublished() : !statement.isPublished(),
    );
  }
}
