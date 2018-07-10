import * as React from 'react';

import { Alignment, AnchorButton, Button, Colors, Navbar } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { IState } from '../reducers';

interface IProps {
  currentUser: IState['currentUser']['user'];
}

function Header(props: IProps) {
  return (
    <Navbar fixedToTop>
      <Navbar.Group align={Alignment.LEFT}>
        <Navbar.Heading>
          <NavLink to="/admin" style={{ color: Colors.DARK_GRAY1 }}>
            Demagog
          </NavLink>
        </Navbar.Heading>
      </Navbar.Group>

      <Navbar.Group align={Alignment.RIGHT}>
        {props.currentUser !== null && (
          <>
            <Button
              icon="user"
              minimal
              text={`${props.currentUser.first_name} ${props.currentUser.last_name}`}
            />
            <Navbar.Divider />
          </>
        )}
        <AnchorButton icon="log-out" minimal text="Odhlásit se" href="/sign_out" />
      </Navbar.Group>
    </Navbar>
  );
}

const mapStateToProps = (state: IState) => ({
  currentUser: state.currentUser.user,
});

export default connect(mapStateToProps)(Header);
