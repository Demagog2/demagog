export class Assessment {
  constructor(protected evaluationStatus: string, protected veracity?: string) {}

  getVeracity() {
    return this.veracity;
  }

  getEvaluationStatus() {
    return this.evaluationStatus;
  }
}
