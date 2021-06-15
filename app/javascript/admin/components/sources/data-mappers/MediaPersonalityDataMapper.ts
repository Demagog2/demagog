import { GetSource_source_mediaPersonalities } from '../../../operation-result-types';
import { MediaPersonality } from '../speaker-stats-report/model/MediaPersonality';

export function createMediaPersonalityFromQuery(
  mediaPersonality: GetSource_source_mediaPersonalities,
) {
  return new MediaPersonality(mediaPersonality.id, mediaPersonality.name);
}
