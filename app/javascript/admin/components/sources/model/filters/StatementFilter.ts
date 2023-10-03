import type { Statement } from '../Statement';

export interface IStatementFilter {
  getKey: () => string;
  getLabel: (statements: Statement[]) => string;
  getGroupLabel?: () => string;

  apply: (statements: Statement[]) => Statement[];
}
