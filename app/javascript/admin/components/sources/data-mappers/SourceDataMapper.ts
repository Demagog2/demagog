import { GetSourceDetail } from '../../../operation-result-types';
import { Source } from '../model/Source';
import { createSpeakerFromQuery } from './SpeakerDataMapper';
import { createStatementFromQuery } from './StatementDataMapper';
import { createExpertFromQuery } from './ExpertDataMapper';
import { createMediumFromQuery } from './MediumDataMapper';
import { createMediaPersonalityFromQuery } from './MediaPersonalityDataMapper';

export function createSourceFromQuery(data: GetSourceDetail) {
  const speakers = data.source.speakers?.map(createSpeakerFromQuery) ?? [];
  const statements = data.statements.map(createStatementFromQuery) ?? [];
  const experts = data.source.experts?.map(createExpertFromQuery) ?? [];
  const medium = createMediumFromQuery(data.source.medium);
  const mediaPersonalities =
    data.source.mediaPersonalities?.map(createMediaPersonalityFromQuery) ?? [];

  return new Source(
    data.source.id,
    data.source.name,
    data.source.sourceUrl,
    data.source.releasedAt,
    experts,
    speakers,
    statements,
    mediaPersonalities,
    medium,
  );
}
