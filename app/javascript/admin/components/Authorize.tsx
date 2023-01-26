import * as React from 'react';

import { useSelector } from 'react-redux';

import { isAuthorized } from '../authorization';
import { IState } from '../reducers';

interface IProps {
  permissions: string[];
  bypass?: boolean;
}

export default function Authorize(props: React.PropsWithChildren<IProps>) {
  const authorized = useSelector((state: IState) => isAuthorized(state.currentUser.user))

  if (!props.bypass && !authorized(props.permissions)) {
    return null;
  }

  return <>{props.children}</>;
}
