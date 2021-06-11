import { Factory } from 'fishery';
import { Statement } from './Statement';
import { Speaker } from './Speaker';
import {
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_BEING_EVALUATED,
  ASSESSMENT_STATUS_PROOFREADING_NEEDED,
} from '../../../../constants';
import { Assessment } from './Assessment';

class StatementFactory extends Factory<
  Statement,
  { speaker_id: string; veracity: string; evaluationStatus: string }
> {
  withSpeaker(speaker: Speaker) {
    return this.transient({ speaker_id: speaker.getId() });
  }

  approved() {
    return this.transient({ evaluationStatus: ASSESSMENT_STATUS_APPROVED });
  }

  proofread() {
    return this.transient({ evaluationStatus: ASSESSMENT_STATUS_PROOFREADING_NEEDED });
  }

  beingEvaluated() {
    return this.transient({ evaluationStatus: ASSESSMENT_STATUS_BEING_EVALUATED });
  }

  true() {
    return this.transient({ veracity: 'true' });
  }

  untrue() {
    return this.transient({ veracity: 'untrue' });
  }
}

export const statementFactory = StatementFactory.define(({ sequence, transientParams }) => {
  return new Statement(
    transientParams.speaker_id || String(sequence),
    new Assessment(
      transientParams.evaluationStatus ?? ASSESSMENT_STATUS_APPROVED,
      transientParams.veracity,
    ),
  );
});
