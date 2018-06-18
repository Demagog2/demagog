export const ASSESSMENT_STATUS_UNASSIGNED = 'unassigned';
export const ASSESSMENT_STATUS_BEING_EVALUATED = 'being_evaluated';
export const ASSESSMENT_STATUS_APPROVAL_NEEDED = 'approval_needed';
export const ASSESSMENT_STATUS_APPROVED = 'approved';

export const ASSESSMENT_STATUS_LABELS = {
  [ASSESSMENT_STATUS_UNASSIGNED]: 'nepřiřazený',
  [ASSESSMENT_STATUS_BEING_EVALUATED]: 've zpracování',
  [ASSESSMENT_STATUS_APPROVAL_NEEDED]: 'ke kontrole',
  [ASSESSMENT_STATUS_APPROVED]: 'schválený',
};
