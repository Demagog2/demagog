import { GetSourceDetail_source_medium } from '../../../operation-result-types';
import { Medium } from '../speaker-stats-report/model/Medium';

export function createMediumFromQuery(medium: GetSourceDetail_source_medium | null) {
  if (!medium) {
    return null;
  }

  return new Medium(medium.id, medium.name);
}
