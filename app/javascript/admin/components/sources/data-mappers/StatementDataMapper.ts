import { GetSourceStatements_statements } from '../../../operation-result-types';
import { Statement } from '../speaker-stats-report/model/Statement';
import { Assessment } from '../speaker-stats-report/model/Assessment';
import { Evaluator } from '../speaker-stats-report/model/Evaluator';

export function createStatementFromQuery(statement: GetSourceStatements_statements) {
  return new Statement(
    statement.speaker.id,
    statement.published,
    new Assessment(statement.assessment.evaluationStatus, statement.assessment.veracity?.key),
    statement.assessment.evaluator
      ? new Evaluator(
          statement.assessment.evaluator?.id,
          statement.assessment.evaluator?.firstName,
          statement.assessment.evaluator?.lastName,
        )
      : null,
  );
}
