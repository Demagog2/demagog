export class Evaluator {
  constructor(protected id: string, protected firstName: string, protected lastName: string) {}

  public getId() {
    return this.id;
  }

  public getFirstName() {
    return this.firstName;
  }

  public getLastName() {
    return this.lastName;
  }

  public getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
