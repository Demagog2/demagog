import { Statement } from '../Statement';

export interface IStatementFilter {
  getKey(): string;
  getLabel(statements: Statement[]): string;

  apply(statements: Statement[]): Statement[];
}
