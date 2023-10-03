import type { SourceSpeaker } from './SourceSpeaker';
import type { Statement } from './Statement';
import type { Expert } from './Expert';
import type { Medium } from './Medium';
import type { MediaPersonality } from './MediaPersonality';

export interface ISource {
  id: string;
  name: string;
  sourceUrl: string | null;
  releasedAt: string | null;
  experts: Expert[];
  sourceSpeakers: SourceSpeaker[];
  statements: Statement[];
  mediaPersonalities: MediaPersonality[];
  medium: Medium | null;
}

export const EMPTY_SOURCE: ISource = {
  id: '-1',
  name: 'Empty Source',
  experts: [],
  mediaPersonalities: [],
  medium: null,
  releasedAt: null,
  sourceUrl: null,
  sourceSpeakers: [],
  statements: [],
};
