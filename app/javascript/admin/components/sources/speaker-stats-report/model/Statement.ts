import { Speaker } from './Speaker';
import {
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_PROOFREADING_NEEDED,
} from '../../../../constants';
import { Evaluator } from './Evaluator';

export class Statement {
  constructor(
    private id: string,
    private content: string,
    private speaker: Speaker,
    private published: boolean,
    private evaluationStatus: string,
    private explanationCharactersLength: number,
    private shortExplanationCharactersLength: number,
    private commentsCount: number,
    private evaluator: Evaluator | null,
    private veracity?: string,
  ) {}

  public getId() {
    return this.id;
  }

  public getContent() {
    return this.content;
  }

  public getSpeaker() {
    return this.speaker;
  }

  public getVeracity() {
    return this.veracity;
  }

  public getEvaluator() {
    return this.evaluator;
  }

  public getCommentsCount() {
    return this.commentsCount;
  }

  public belongsTo(speaker: Speaker) {
    return this.speaker.getId() === speaker.getId();
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
    return this.evaluationStatus === status;
  }

  public isFinallyEvaluated() {
    return [ASSESSMENT_STATUS_APPROVED, ASSESSMENT_STATUS_PROOFREADING_NEEDED].includes(
      this.evaluationStatus,
    );
  }

  public getEvaluationStatus() {
    return this.evaluationStatus;
  }

  public getShortExplanationCharactersLength() {
    return this.shortExplanationCharactersLength;
  }

  public getExplanationCharactersLength() {
    return this.explanationCharactersLength;
  }
}
