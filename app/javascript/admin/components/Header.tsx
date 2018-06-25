import * as React from 'react';

import { connect } from 'react-redux';

import { IState } from '../reducers';

interface IProps {
  currentUser: IState['currentUser']['user'];
}

function Header(props: IProps) {
  return (
    <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
      <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="/admin">
        Demagog.cz
      </a>
      {props.currentUser && (
        <span className="navbar-text ml-auto">
          {props.currentUser.first_name} {props.currentUser.last_name}
        </span>
      )}
      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap">
          <a className="nav-link" data-method="delete" href="/sign_out">
            Odhlásit se
          </a>
        </li>
      </ul>
    </nav>
  );
}

const mapStateToProps = (state: IState) => ({
  currentUser: state.currentUser.user,
});

export default connect(mapStateToProps)(Header);
