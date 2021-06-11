import { Speaker } from './Speaker';
import {
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_PROOFREADING_NEEDED,
} from '../../../../constants';
import { Assessment } from './Assessment';

export class Statement {
  constructor(protected speaker_id: string, protected assessment: Assessment) {}

  getVeracity() {
    return this.assessment.getVeracity();
  }

  belongsTo(speaker: Speaker) {
    return this.speaker_id === speaker.getId();
  }

  isFinallyEvaluated() {
    return [ASSESSMENT_STATUS_APPROVED, ASSESSMENT_STATUS_PROOFREADING_NEEDED].includes(
      this.assessment.getEvaluationStatus(),
    );
  }
}
