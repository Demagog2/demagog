import { Factory } from 'fishery';
import { Statement } from './Statement';
import { Speaker } from './Speaker';
import {
  ASSESSMENT_STATUS_APPROVAL_NEEDED,
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_BEING_EVALUATED,
  ASSESSMENT_STATUS_PROOFREADING_NEEDED,
} from '../../../../constants';
import { Assessment } from './Assessment';
import { Evaluator } from './Evaluator';

class StatementFactory extends Factory<
  Statement,
  {
    speaker_id: string;
    veracity: string;
    evaluationStatus: string;
    published: boolean;
    evaluator: Evaluator | null;
  }
> {
  public withSpeaker(speaker: Speaker) {
    return this.transient({ speaker_id: speaker.getId() });
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
}

export const statementFactory = StatementFactory.define(({ sequence, transientParams }) => {
  return new Statement(
    transientParams.speaker_id || String(sequence),
    transientParams.published ?? false,
    new Assessment(
      transientParams.evaluationStatus ?? ASSESSMENT_STATUS_APPROVED,
      transientParams.veracity,
    ),
    typeof transientParams.evaluator !== 'undefined'
      ? transientParams.evaluator
      : new Evaluator(String(sequence), `John ${sequence}`, `Doe`),
  );
});
