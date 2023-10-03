import { intersection } from 'lodash';

import type { IState } from './reducers';

export const isAuthorized = (currentUser: IState['currentUser']['user']) => (
  permissionsNeeded: string[],
) => {
  if (!currentUser) {
    return false;
  }

  return intersection(currentUser.role.permissions, permissionsNeeded).length > 0;
};
