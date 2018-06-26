import { intersection } from 'lodash';

import { IState } from './reducers';

export const ROLE_ADMIN = 'admin';
export const ROLE_EXPERT = 'expert';
export const ROLE_SOCIAL_MEDIA_MANAGER = 'social_media_manager';
export const ROLE_PROOFREADER = 'proofreader';
export const ROLE_INTERN = 'intern';

const ROLE_PERMISSIONS = {
  [ROLE_SOCIAL_MEDIA_MANAGER]: [
    'sources:view',
    'statements:view-unapproved-evaluation',
    'statements:comments:add',
  ],
  [ROLE_PROOFREADER]: [
    'sources:view',
    'statements:edit-texts',
    'statements:view-unapproved-evaluation',
    'statements:comments:add',
  ],
  [ROLE_INTERN]: ['sources:view', 'statements:edit-evaluated', 'statements:comments:add'],
};

export function isRoleAuthorized(roleKey: string, permissionsNeeded: string[]) {
  if (roleKey === ROLE_ADMIN || roleKey === ROLE_EXPERT) {
    return true;
  }

  const permissions = ROLE_PERMISSIONS[roleKey];

  return intersection(permissions, permissionsNeeded).length > 0;
}

export function isCurrentUserAuthorized(
  currentUser: IState['currentUser']['user'],
  permissionsNeeded: string[],
) {
  if (currentUser === null) {
    return false;
  }

  return isRoleAuthorized(currentUser.role.key, permissionsNeeded);
}
