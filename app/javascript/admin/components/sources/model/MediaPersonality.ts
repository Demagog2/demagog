export class MediaPersonality {
  constructor(public id: string, private readonly name: string) {}

  public getName() {
    return this.name;
  }
}
