import type { GetSourceDetail } from '../../../operation-result-types';
import type { ISource } from '../model/Source';
import { createSpeakerFromQuery } from './SpeakerDataMapper';
import { createStatementFromQuery } from './StatementDataMapper';
import { createExpertFromQuery } from './ExpertDataMapper';
import { createMediumFromQuery } from './MediumDataMapper';
import { createMediaPersonalityFromQuery } from './MediaPersonalityDataMapper';

export function createSourceFromQuery(data: GetSourceDetail): ISource {
  const sourceSpeakers = data.source.sourceSpeakers?.map(createSpeakerFromQuery) ?? [];
  const statements = data.statements.map(createStatementFromQuery) ?? [];
  const experts = data.source.experts?.map(createExpertFromQuery) ?? [];
  const medium = createMediumFromQuery(data.source.medium);
  const mediaPersonalities =
    data.source.mediaPersonalities?.map(createMediaPersonalityFromQuery) ?? [];

  return {
    id: data.source.id,
    name: data.source.name,
    sourceUrl: data.source.sourceUrl,
    releasedAt: data.source.releasedAt,
    experts,
    sourceSpeakers,
    statements,
    mediaPersonalities,
    medium,
  };
}
