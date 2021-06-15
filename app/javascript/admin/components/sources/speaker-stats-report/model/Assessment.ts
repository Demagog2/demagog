export class Assessment {
  constructor(private evaluationStatus: string, private veracity?: string) {}

  getVeracity() {
    return this.veracity;
  }

  getEvaluationStatus() {
    return this.evaluationStatus;
  }
}
