import { Speaker } from '../speaker-stats-report/model/Speaker';
import { Statement } from '../speaker-stats-report/model/Statement';
import { Expert } from './Expert';
import { Medium } from '../speaker-stats-report/model/Medium';
import { MediaPersonality } from '../speaker-stats-report/model/MediaPersonality';

export class Source {
  constructor(
    protected _id: string,
    protected _name: string,
    protected _sourceUrl: string | null,
    protected _releasedAt: string | null,
    protected _experts: Expert[],
    protected _speakers: Speaker[],
    protected _statements: Statement[],
    protected _mediaPersonalities: MediaPersonality[],
    protected _medium: Medium | null,
  ) {}

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  get sourceUrl() {
    return this._sourceUrl;
  }

  get releasedAt() {
    return this._releasedAt;
  }

  get experts() {
    return this._experts;
  }

  get medium() {
    return this._medium;
  }

  get mediaPersonalities() {
    return this._mediaPersonalities;
  }

  get speakers() {
    return this._speakers;
  }

  get statements() {
    return this._statements;
  }
}
