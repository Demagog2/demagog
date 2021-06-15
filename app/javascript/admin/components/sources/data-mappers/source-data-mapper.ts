import { GetSourceDetail } from '../../../operation-result-types';
import { Source } from '../model/Source';
import { createSpeakerFromQuery } from '../speaker-stats-report/data-mappers/SpeakerDataMapper';
import { createStatementFromQuery } from '../speaker-stats-report/data-mappers/StatementDataMapper';

export function createSourceFromQuery(data: GetSourceDetail) {
  const speakers = data.source.speakers?.map(createSpeakerFromQuery) ?? [];
  const statements = data.statements.map(createStatementFromQuery) ?? [];

  return new Source(data.source.id, data.source.name, speakers, statements);
}
