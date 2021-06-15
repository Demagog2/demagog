import { GetSourceDetail_source_speakers } from '../../../operation-result-types';
import { Speaker } from '../speaker-stats-report/model/Speaker';

export function createSpeakerFromQuery(speaker: GetSourceDetail_source_speakers) {
  return new Speaker(speaker.id, speaker.firstName, speaker.lastName);
}
