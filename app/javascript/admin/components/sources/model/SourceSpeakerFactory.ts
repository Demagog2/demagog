import { Factory } from 'fishery';
import { SourceSpeaker } from './SourceSpeaker';

export const sourceSpeakerFactory = Factory.define<SourceSpeaker>(({ sequence }) => {
  return new SourceSpeaker(String(sequence), `First name ${sequence}`, 'Doe');
});
