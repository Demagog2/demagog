import { GetSourceDetail_source_sourceSpeakers } from '../../../operation-result-types';
import { SourceSpeaker } from '../model/SourceSpeaker';

export function createSpeakerFromQuery(sourceSpeaker: GetSourceDetail_source_sourceSpeakers) {
  return new SourceSpeaker(sourceSpeaker.id, sourceSpeaker.firstName, sourceSpeaker.lastName);
}
