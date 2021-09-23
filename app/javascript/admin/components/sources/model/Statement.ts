import {
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_PROOFREADING_NEEDED,
} from '../../../constants';
import { Evaluator } from './Evaluator';
import { SourceSpeaker } from './SourceSpeaker';

export class Statement {
  constructor(
    private id: string,
    private content: string,
    private sourceSpeaker: SourceSpeaker,
    private published: boolean,
    private evaluationStatus: string,
    private assessmentMethodology: string,
    private explanationCharactersLength: number,
    private shortExplanationCharactersLength: number,
    private commentsCount: number,
    private evaluator: Evaluator | null,
    private veracity?: string,
    private promiseRating?: string,
  ) {}

  public getId() {
    return this.id;
  }

  public getContent() {
    return this.content;
  }

  public getSourceSpeaker() {
    return this.sourceSpeaker;
  }

  public getVeracity() {
    return this.veracity;
  }

  public getPromiseRating() {
    return this.promiseRating;
  }

  public getEvaluator() {
    return this.evaluator;
  }

  public getCommentsCount() {
    return this.commentsCount;
  }

  public belongsTo(sourceSpeaker: SourceSpeaker) {
    return this.sourceSpeaker.getId() === sourceSpeaker.getId();
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

  public getAssessmentMethodology() {
    return this.assessmentMethodology;
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
