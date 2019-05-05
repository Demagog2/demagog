export const ASSESSMENT_STATUS_BEING_EVALUATED = 'being_evaluated';
export const ASSESSMENT_STATUS_APPROVAL_NEEDED = 'approval_needed';
export const ASSESSMENT_STATUS_PROOFREADING_NEEDED = 'proofreading_needed';
export const ASSESSMENT_STATUS_APPROVED = 'approved';

export const ASSESSMENT_STATUS_LABELS = {
  [ASSESSMENT_STATUS_BEING_EVALUATED]: 've zpracování',
  [ASSESSMENT_STATUS_APPROVAL_NEEDED]: 'ke kontrole',
  [ASSESSMENT_STATUS_PROOFREADING_NEEDED]: 'ke korektuře',
  [ASSESSMENT_STATUS_APPROVED]: 'schválený',
};

export const STATEMENT_TYPE_FACTUAL = 'factual';
export const STATEMENT_TYPE_PROMISE = 'promise';
