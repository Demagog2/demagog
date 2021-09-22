import { GetSourceDetail_statements } from '../../../operation-result-types';
import { Statement } from '../model/Statement';
import { Evaluator } from '../model/Evaluator';
import { SourceSpeaker } from '../model/SourceSpeaker';

export function createStatementFromQuery(statement: GetSourceDetail_statements) {
  return new Statement(
    statement.id,
    statement.content,
    new SourceSpeaker(
      statement.sourceSpeaker.id,
      statement.sourceSpeaker.firstName,
      statement.sourceSpeaker.lastName,
    ),
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
