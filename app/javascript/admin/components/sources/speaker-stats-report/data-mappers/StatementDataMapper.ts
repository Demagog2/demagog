import { GetSourceStatements_statements } from '../../../../operation-result-types';
import { Statement } from '../model/Statement';
import { Assessment } from '../model/Assessment';

export function createStatementFromQuery(statement: GetSourceStatements_statements) {
  return new Statement(
    statement.speaker.id,
    new Assessment(statement.assessment.evaluationStatus, statement.assessment.veracity?.key),
  );
}
