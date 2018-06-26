import { intersection } from 'lodash';

import { IState } from './reducers';

export const isAuthorized = (
  roles: IState['roles']['roles'],
  currentUser: IState['currentUser']['user'],
) => (permissionsNeeded: string[]) => {
  if (!roles || !currentUser) {
    return false;
  }

  const role = roles.find((r) => r.key === currentUser.role.key);
  const permissions = role ? role.permissions : [];

  return intersection(permissions, permissionsNeeded).length > 0;
};
