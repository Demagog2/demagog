import * as React from 'react';

import { Alignment, AnchorButton, Button, Classes, Colors, Navbar } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as classNames from 'classnames';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { GetNotificationsQuery, GetNotificationsQueryVariables } from '../operation-result-types';
import { GetNotifications } from '../queries/queries';
import { IState } from '../reducers';

class GetNotificationsQueryComponent extends Query<
  GetNotificationsQuery,
  GetNotificationsQueryVariables
> {}

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
        <GetNotificationsQueryComponent query={GetNotifications} variables={{ includeRead: false }}>
          {({ data, loading, error }) => {
            if (loading || !data) {
              return null;
            }

            if (error) {
              console.error(error); // tslint:disable-line:no-console
              return null;
            }

            return (
              <>
                <NavLink
                  to="/admin/notifications"
                  className={classNames(
                    Classes.BUTTON,
                    Classes.iconClass(IconNames.NOTIFICATIONS),
                    {
                      [Classes.MINIMAL]: data.notifications.total_count === 0,
                      [Classes.INTENT_DANGER]: data.notifications.total_count > 0,
                    },
                  )}
                >
                  {`${data.notifications.total_count}`}
                </NavLink>
                <Navbar.Divider />
              </>
            );
          }}
        </GetNotificationsQueryComponent>

        {props.currentUser !== null && (
          <>
            <Button
              icon={IconNames.USER}
              minimal
              text={`${props.currentUser.first_name} ${props.currentUser.last_name}`}
            />
            <Navbar.Divider />
          </>
        )}
        <AnchorButton icon={IconNames.LOG_OUT} minimal text="Odhlásit se" href="/sign_out" />
      </Navbar.Group>
    </Navbar>
  );
}

const mapStateToProps = (state: IState) => ({
  currentUser: state.currentUser.user,
});

export default connect(mapStateToProps)(Header);
