export class StatsReport {
  constructor(
    protected _id: string,
    protected _title: string,
    protected _stats: { key: string; count: number }[],
  ) {}

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get stats() {
    return this._stats;
  }
}
