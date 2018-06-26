import * as React from 'react';

import { connect } from 'react-redux';

import { isRoleAuthorized } from '../authorization';
import { IState } from '../reducers';

interface IProps {
  currentUser: IState['currentUser']['user'];
  children: React.ReactNode;
  permissions: string[];
}

class Authorize extends React.Component<IProps> {
  public render() {
    if (!this.props.currentUser) {
      return null;
    }

    if (!isRoleAuthorized(this.props.currentUser.role.key, this.props.permissions)) {
      return null;
    }

    return this.props.children;
  }
}

const mapStateToProps = (state: IState) => ({
  currentUser: state.currentUser.user,
});

export default connect(mapStateToProps)(Authorize);
