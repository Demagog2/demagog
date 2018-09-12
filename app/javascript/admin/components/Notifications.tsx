import * as React from 'react';

import { Button, Classes } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as classNames from 'classnames';
import { distanceInWordsToNow } from 'date-fns';
import * as dateFnsCsLocale from 'date-fns/locale/cs';
import { DateTime } from 'luxon';
import { Mutation, Query } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import apolloClient from '../apolloClient';
import { GetNotificationsQuery, GetNotificationsQueryVariables } from '../operation-result-types';
import { MarkUnreadNotificationsAsRead, UpdateNotification } from '../queries/mutations';
import { GetNotifications } from '../queries/queries';
import { displayDateTime } from '../utils';
import Loading from './Loading';

class GetNotificationsQueryComponent extends Query<
  GetNotificationsQuery,
  GetNotificationsQueryVariables
> {}

interface IProps extends RouteComponentProps<{}> {
  dispatch: Dispatch;
}

interface IState {
  isLoadingMore: boolean;
}

class Notifications extends React.Component<IProps, IState> {
  public state = {
    isLoadingMore: false,
  };

  public handleNotificationClick = (
    notification: GetNotificationsQuery['notifications']['items'][0],
  ) => () => {
    if (notification.read_at) {
      this.props.history.push(notification.action_link);
    } else {
      this.markAsRead(notification).then(() => {
        this.props.history.push(notification.action_link);
      });
    }
  };

  public markAsRead = (notification) => {
    return apolloClient.mutate({
      mutation: UpdateNotification,
      variables: { id: notification.id, input: { read_at: DateTime.local().toISOTime() } },
      refetchQueries: [
        {
          query: GetNotifications,
          variables: { includeRead: false, limit: 0, offset: 0 },
        },
      ],
    });
  };

  public render() {
    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <div style={{ float: 'right' }}>
          <Mutation
            mutation={MarkUnreadNotificationsAsRead}
            onCompleted={() => {
              this.props.dispatch(
                addFlashMessage('Všechny upozornění úspěšně označeny za přečtené', 'success'),
              );
            }}
            onError={() =>
              this.props.dispatch(
                addFlashMessage('Došlo k chybě při označování upozornění jako přečtené', 'error'),
              )
            }
            update={(cache) => {
              // Reset unread notifications count in the header to zero
              const data = {
                notifications: {
                  items: [],
                  total_count: 0,
                  __typename: 'NotificationsResult',
                },
              };
              cache.writeQuery({
                query: GetNotifications,
                variables: { includeRead: false, offset: 0, limit: 0 },
                data,
              });
            }}
          >
            {(markUnreadNotificationsAsRead, { loading }) => (
              <button
                className={classNames(Classes.BUTTON, Classes.iconClass(IconNames.TICK))}
                onClick={() => markUnreadNotificationsAsRead()}
                disabled={loading}
              >
                {loading ? 'Označuji všechny jako přečtené…' : 'Označit všechny jako přečtené'}
              </button>
            )}
          </Mutation>
        </div>

        <h2 className={Classes.HEADING}>Upozornění</h2>

        <div style={{ marginTop: 15 }}>
          <GetNotificationsQueryComponent
            query={GetNotifications}
            variables={{ includeRead: true, offset: 0, limit: 20 }}
            fetchPolicy="network-only"
          >
            {({ data, loading, error, fetchMore }) => {
              if (loading || !data) {
                return <Loading />;
              }

              if (error) {
                console.error(error); // tslint:disable-line:no-console
                return null;
              }

              return (
                <>
                  <table
                    className={classNames(
                      Classes.HTML_TABLE,
                      Classes.HTML_TABLE_BORDERED,

                      Classes.INTERACTIVE,
                    )}
                    style={{ width: '100%' }}
                  >
                    <tbody>
                      {data.notifications.items.map((notification) => (
                        <tr
                          key={notification.id}
                          style={{
                            backgroundColor: notification.read_at ? 'transparent' : '#cdecff',
                          }}
                          onClick={this.handleNotificationClick(notification)}
                        >
                          <td>
                            {notification.content}
                            <br />
                            <small className={Classes.TEXT_MUTED}>
                              {distanceInWordsToNow(notification.created_at, {
                                locale: dateFnsCsLocale,
                                addSuffix: true,
                              })}
                              {' — '}
                              {displayDateTime(notification.created_at)}
                            </small>
                          </td>
                        </tr>
                      ))}
                      {data.notifications.total_count > data.notifications.items.length && (
                        <tr>
                          <td colSpan={6} style={{ textAlign: 'center' }}>
                            <Button
                              type="button"
                              text={this.state.isLoadingMore ? 'Nahrávám…' : 'Zobrazit další…'}
                              disabled={this.state.isLoadingMore}
                              large
                              minimal
                              onClick={() => {
                                this.setState({ isLoadingMore: true });

                                fetchMore({
                                  variables: {
                                    offset: data.notifications.items.length,
                                  },
                                  updateQuery: (prev, { fetchMoreResult }) => {
                                    if (!fetchMoreResult) {
                                      return prev;
                                    }

                                    return {
                                      notifications: {
                                        ...prev.notifications,
                                        items: [
                                          ...prev.notifications.items,
                                          ...fetchMoreResult.notifications.items,
                                        ],
                                      },
                                    };
                                  },
                                }).finally(() => {
                                  this.setState({ isLoadingMore: false });
                                });
                              }}
                            />
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              );
            }}
          </GetNotificationsQueryComponent>
        </div>
      </div>
    );
  }
}

export default connect()(withRouter(Notifications));
