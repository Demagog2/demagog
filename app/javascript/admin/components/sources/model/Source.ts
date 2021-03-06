import { Speaker } from './Speaker';
import { Statement } from './Statement';
import { Expert } from './Expert';
import { Medium } from './Medium';
import { MediaPersonality } from './MediaPersonality';

export interface ISource {
  id: string;
  name: string;
  sourceUrl: string | null;
  releasedAt: string | null;
  experts: Expert[];
  speakers: Speaker[];
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
  speakers: [],
  statements: [],
};
