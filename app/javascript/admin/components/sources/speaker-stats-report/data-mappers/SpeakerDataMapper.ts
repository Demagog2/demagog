import { GetSource_source_speakers } from '../../../../operation-result-types';
import { Speaker } from '../model/Speaker';

export function createSpeakerFromQuery(speaker: GetSource_source_speakers) {
  return new Speaker(speaker.id, speaker.firstName, speaker.lastName);
}
