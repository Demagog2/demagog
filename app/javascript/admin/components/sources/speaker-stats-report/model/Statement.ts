import { Speaker } from './Speaker';
import {
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_PROOFREADING_NEEDED,
} from '../../../../constants';
import { Assessment } from './Assessment';
import { Evaluator } from './Evaluator';

export class Statement {
  constructor(
    private speakerId: string,
    private published: boolean,
    private assessment: Assessment,
    private evaluator: Evaluator | null,
  ) {}

  public getVeracity() {
    return this.assessment.getVeracity();
  }

  public getEvaluator() {
    return this.evaluator;
  }

  public belongsTo(speaker: Speaker) {
    return this.speakerId === speaker.getId();
  }

  public evaluatedBy(evaluator: Evaluator) {
    if (!this.evaluator) {
      return false;
    }

    return this.evaluator.getId() === evaluator.getId();
  }

  public isPublished() {
    return this.published;
  }

  public hasEvaluationStatus(status: string) {
    return this.assessment.getEvaluationStatus() === status;
  }

  public isFinallyEvaluated() {
    return [ASSESSMENT_STATUS_APPROVED, ASSESSMENT_STATUS_PROOFREADING_NEEDED].includes(
      this.assessment.getEvaluationStatus(),
    );
  }
}
