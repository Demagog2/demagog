import * as React from 'react';

import {
  Alignment,
  AnchorButton,
  Button,
  Classes,
  Colors,
  Dialog,
  Intent,
  Navbar,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as classNames from 'classnames';
import { Query } from 'react-apollo';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import type {
  GetNotifications as GetNotificationsQuery,
  GetNotificationsVariables as GetNotificationsQueryVariables,
} from '../operation-result-types';
import { GetNotifications } from '../queries/queries';
import type { IState as ReduxState } from '../reducers';
import Authorize from './Authorize';
import UserSelect from './forms/controls/UserSelect';

interface IProps {
  currentUser: ReduxState['currentUser']['user'];
}

interface IState {
  showBecomeAnotherUserDialog: boolean;
}

class Header extends React.Component<IProps, IState> {
  public state = {
    showBecomeAnotherUserDialog: false,
  };

  public toggleBecomeAnotherUserDialog = () => {
    this.setState({ showBecomeAnotherUserDialog: !this.state.showBecomeAnotherUserDialog });
  };

  public render() {
    return (
      <>
        {this.state.showBecomeAnotherUserDialog && (
          <BecomeAnotherUserDialog onCancel={this.toggleBecomeAnotherUserDialog} />
        )}

        <Navbar fixedToTop>
          <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading>
              <NavLink to="/admin" style={{ color: Colors.DARK_GRAY1 }}>
                Demagog
              </NavLink>
            </Navbar.Heading>
          </Navbar.Group>

          <Navbar.Group align={Alignment.RIGHT}>
            <Authorize permissions={['admin:become-another-user']}>
              <>
                <Button
                  icon={IconNames.PEOPLE}
                  minimal
                  onClick={this.toggleBecomeAnotherUserDialog}
                />
                <Navbar.Divider />
              </>
            </Authorize>

            <Query<GetNotificationsQuery, GetNotificationsQueryVariables>
              query={GetNotifications}
              // offset & limit 0, because we only need the total_count
              variables={{ includeRead: false, offset: 0, limit: 0 }}
              pollInterval={20100} // Little more than 20s so it does not sync with other polls
            >
              {({ data, error }) => {
                if (!data?.notifications) {
                  return null;
                }

                if (error) {
                  console.error(error); return null;
                }

                return (
                  <>
                    <NavLink
                      to="/admin/notifications"
                      className={classNames(
                        Classes.BUTTON,
                        Classes.iconClass(IconNames.NOTIFICATIONS),
                        {
                          [Classes.MINIMAL]: data.notifications.totalCount === 0,
                          [Classes.INTENT_PRIMARY]: data.notifications.totalCount > 0,
                        },
                      )}
                    >
                      {`${data.notifications.totalCount}`}
                    </NavLink>
                    <Navbar.Divider />
                  </>
                );
              }}
            </Query>

            {this.props.currentUser !== null && (
              <>
                <Button
                  icon={IconNames.USER}
                  minimal
                  text={`${this.props.currentUser.firstName} ${this.props.currentUser.lastName}`}
                />
                <Navbar.Divider />
              </>
            )}
            <AnchorButton icon={IconNames.LOG_OUT} minimal text="Odhlásit se" href="/sign_out" />
          </Navbar.Group>
        </Navbar>
      </>
    );
  }
}

interface IBecomeAnotherUserDialogProps {
  onCancel: () => void;
}

interface IBecomeAnotherUserDialogState {
  userId: string | null;
}

class BecomeAnotherUserDialog extends React.Component<
IBecomeAnotherUserDialogProps,
IBecomeAnotherUserDialogState
> {
  public state = {
    userId: null,
  };

  public render() {
    const { onCancel } = this.props;

    const { userId } = this.state;

    return (
      <Dialog isOpen onClose={onCancel} title="Přihlásit se jako někdo jiný">
        <div className={Classes.DIALOG_BODY}>
          <UserSelect value={userId} onChange={(value) => { this.setState({ userId: value }); }} />
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button text="Zpět" onClick={onCancel} />
            <AnchorButton
              href={`/admin/become-another-user/${userId}`}
              disabled={userId === null}
              text="Přihlásit"
              onClick={onCancel}
              intent={Intent.PRIMARY}
            />
          </div>
        </div>
      </Dialog>
    );
  }
}

const mapStateToProps = (state: ReduxState) => ({
  currentUser: state.currentUser.user,
});

export default connect(mapStateToProps)(Header);
