import { Factory } from 'fishery';
import { Speaker } from './Speaker';

export const speakerFactory = Factory.define<Speaker>(({ sequence }) => {
  return new Speaker(String(sequence), `First name ${sequence}`, 'Doe');
});
