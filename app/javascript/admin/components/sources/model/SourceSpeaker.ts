export class SourceSpeaker {
  constructor(private readonly id: string, private readonly firstName: string, private readonly lastName: string) {}

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
