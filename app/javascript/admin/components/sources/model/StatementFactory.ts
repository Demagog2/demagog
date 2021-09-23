import { Factory } from 'fishery';
import { Statement } from './Statement';
import { SourceSpeaker } from './SourceSpeaker';
import {
  ASSESSMENT_STATUS_APPROVAL_NEEDED,
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_BEING_EVALUATED,
  ASSESSMENT_STATUS_PROOFREADING_NEEDED,
} from '../../../constants';
import { Evaluator } from './Evaluator';
import { sourceSpeakerFactory } from './SourceSpeakerFactory';

class StatementFactory extends Factory<
  Statement,
  {
    sourceSpeaker: SourceSpeaker;
    veracity: string;
    evaluationStatus: string;
    published: boolean;
    evaluator: Evaluator | null;
    explanationCharactersLength: number;
    shortExplanationCharactersLength: number;
    assessmentMethodology: string;
    promiseRating: string;
    commentsCount: number;
  }
> {
  public withSourceSpeaker(sourceSpeaker: SourceSpeaker) {
    return this.transient({ sourceSpeaker });
  }

  public published() {
    return this.transient({ published: true });
  }

  public approved() {
    return this.transient({ evaluationStatus: ASSESSMENT_STATUS_APPROVED });
  }

  public approvalNeeded() {
    return this.transient({ evaluationStatus: ASSESSMENT_STATUS_APPROVAL_NEEDED });
  }

  public proofread() {
    return this.transient({ evaluationStatus: ASSESSMENT_STATUS_PROOFREADING_NEEDED });
  }

  public beingEvaluated() {
    return this.transient({ evaluationStatus: ASSESSMENT_STATUS_BEING_EVALUATED });
  }

  public true() {
    return this.transient({ veracity: 'true' });
  }

  public untrue() {
    return this.transient({ veracity: 'untrue' });
  }

  public withoutEvaluator() {
    return this.transient({ evaluator: null });
  }

  public withEvaluator(evaluator: Evaluator) {
    return this.transient({ evaluator });
  }

  public withPromiseAssessment() {
    return this.transient({ assessmentMethodology: 'promise_rating' });
  }

  public brokenPromise() {
    return this.transient({ promiseRating: 'broken' });
  }

  public fulfilledPromise() {
    return this.transient({ promiseRating: 'fulfilled' });
  }

  public inProgressPromise() {
    return this.transient({ promiseRating: 'in_progress' });
  }
}

export const statementFactory = StatementFactory.define(({ sequence, transientParams }) => {
  return new Statement(
    String(sequence),
    `Content ${sequence}`,
    transientParams.sourceSpeaker || sourceSpeakerFactory.build(),
    transientParams.published ?? false,
    transientParams.evaluationStatus ?? ASSESSMENT_STATUS_APPROVED,
    transientParams.assessmentMethodology || 'veracity',
    transientParams.explanationCharactersLength || 560,
    transientParams.shortExplanationCharactersLength || 100,
    transientParams.commentsCount || 30,
    typeof transientParams.evaluator !== 'undefined'
      ? transientParams.evaluator
      : new Evaluator(String(sequence), `John ${sequence}`, `Doe`),
    transientParams.veracity,
    transientParams.promiseRating,
  );
});
