import { GetSourceDetail_statements } from '../../../operation-result-types';
import { Statement } from '../model/Statement';
import { Evaluator } from '../model/Evaluator';
import { Speaker } from '../model/Speaker';

export function createStatementFromQuery(statement: GetSourceDetail_statements) {
  return new Statement(
    statement.id,
    statement.content,
    new Speaker(statement.speaker.id, statement.speaker.firstName, statement.speaker.lastName),
    statement.published,
    statement.assessment.evaluationStatus,
    statement.assessment.assessmentMethodology.ratingModel,
    statement.assessment.explanationCharactersLength,
    statement.assessment.shortExplanationCharactersLength,
    statement.commentsCount,
    statement.assessment.evaluator
      ? new Evaluator(
          statement.assessment.evaluator?.id,
          statement.assessment.evaluator?.firstName,
          statement.assessment.evaluator?.lastName,
        )
      : null,
    statement.assessment.veracity?.key,
    statement.assessment.promiseRating?.key,
  );
}
