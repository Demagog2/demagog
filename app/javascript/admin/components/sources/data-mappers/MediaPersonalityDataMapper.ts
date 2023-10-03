import type { GetSource_source_mediaPersonalities } from '../../../operation-result-types';
import { MediaPersonality } from '../model/MediaPersonality';

export function createMediaPersonalityFromQuery(
  mediaPersonality: GetSource_source_mediaPersonalities,
) {
  return new MediaPersonality(mediaPersonality.id, mediaPersonality.name);
}
