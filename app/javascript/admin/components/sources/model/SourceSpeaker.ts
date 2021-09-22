export class SourceSpeaker {
  constructor(private id: string, private firstName: string, private lastName: string) {}

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
