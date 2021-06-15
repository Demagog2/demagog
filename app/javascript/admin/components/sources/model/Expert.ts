export class Expert {
  constructor(public id: string, public firstName: string, public lastName: string) {}

  public getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
