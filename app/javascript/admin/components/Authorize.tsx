import * as React from 'react';

import { connect } from 'react-redux';

import { isAuthorized } from '../authorization';
import { IState } from '../reducers';

interface IProps {
  isAuthorized: (permissions: string[]) => boolean;
  children: React.ReactNode;
  permissions: string[];
  bypass?: boolean;
}

class Authorize extends React.Component<IProps> {
  public render() {
    if (!this.props.bypass && !this.props.isAuthorized(this.props.permissions)) {
      return null;
    }

    return this.props.children;
  }
}

const mapStateToProps = (state: IState) => ({
  isAuthorized: isAuthorized(state.currentUser.user),
});

export default connect(mapStateToProps)(Authorize);
