import type { GetSourceDetail_source_experts } from '../../../operation-result-types';
import { Expert } from '../model/Expert';

export function createExpertFromQuery(expert: GetSourceDetail_source_experts): Expert {
  return new Expert(expert.id, expert.firstName, expert.lastName);
}
