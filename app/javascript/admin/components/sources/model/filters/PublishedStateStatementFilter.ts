import type { Statement } from '../Statement';
import type { IStatementFilter } from './StatementFilter';

export class PublishedStateStatementFilter implements IStatementFilter {
  constructor(private readonly state: 'published' | 'unpublished') {}

  public getKey() {
    return this.state;
  }

  public getLabel(statements: Statement[]): string {
    const count = this.apply(statements).length;

    return this.state === 'published' ? `Zveřejněné (${count})` : `Nezveřejněné (${count})`;
  }

  public apply(statements: Statement[]): Statement[] {
    return statements.filter((statement) =>
      this.state === 'published' ? statement.isPublished() : !statement.isPublished(),
    );
  }

  public getGroupLabel(): string {
    return 'Filtrovat dle zveřejnění';
  }
}
