export class Evaluator {
  constructor(protected id: string, protected firstName: string, protected lastName: string) {}

  public getId() {
    return this.id;
  }

  public getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
