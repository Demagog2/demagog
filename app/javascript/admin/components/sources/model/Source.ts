import { Speaker } from '../speaker-stats-report/model/Speaker';
import { Statement } from '../speaker-stats-report/model/Statement';

export class Source {
  constructor(
    protected _id: string,
    protected _name: string,
    protected _speakers: Speaker[],
    protected _statements: Statement[],
  ) {}

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get speakers() {
    return this._speakers;
  }

  get statements() {
    return this._statements;
  }
}
