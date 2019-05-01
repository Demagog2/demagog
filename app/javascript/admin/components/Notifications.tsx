import * as React from 'react';

import { Button, Classes } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { distanceInWordsToNow } from 'date-fns';
import * as dateFnsCsLocale from 'date-fns/locale/cs';
import { css, cx } from 'emotion';
import { DateTime } from 'luxon';
import { Mutation, Query } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import apolloClient from '../apolloClient';
import {
  GetNotificationsQuery,
  GetNotificationsQueryVariables,
  UpdateNotificationMutationVariables,
} from '../operation-result-types';
import { MarkUnreadNotificationsAsRead, UpdateNotification } from '../queries/mutations';
import { GetNotifications } from '../queries/queries';
import { displayDateTime } from '../utils';
import Loading from './Loading';

class GetNotificationsQueryComponent extends Query<
  GetNotificationsQuery,
  GetNotificationsQueryVariables
> {}

interface IProps extends RouteComponentProps<{}>, DispatchProp {}

interface IState {
  isLoadingMore: boolean;
}

class Notifications extends React.Component<IProps, IState> {
  public state = {
    isLoadingMore: false,
  };

  public handleNotificationClick = (
    notification: GetNotificationsQuery['notifications']['items'][0],
  ) => (event: React.MouseEvent<Element>) => {
    const targetElement = event.target as Element;
    if (targetElement.closest('button')) {
      // That's click on the "mark as read/unread button", lets do nothing
      return;
    }

    if (notification.readAt) {
      this.props.history.push(notification.actionLink);
    } else {
      this.markAsRead(notification).then(() => {
        this.props.history.push(notification.actionLink);
      });
    }
  };

  public markAsRead = (notification) => {
    const variables: UpdateNotificationMutationVariables = {
      id: notification.id,
      input: { readAt: DateTime.local().toISOTime() },
    };

    return apolloClient.mutate({
      mutation: UpdateNotification,
      variables,
      refetchQueries: [
        {
          query: GetNotifications,
          variables: { includeRead: false, limit: 0, offset: 0 },
        },
      ],
    });
  };

  public markAsUnread = (notification) => {
    const variables: UpdateNotificationMutationVariables = {
      id: notification.id,
      input: { readAt: null },
    };

    return apolloClient.mutate({
      mutation: UpdateNotification,
      variables,
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
                className={cx(Classes.BUTTON, Classes.iconClass(IconNames.TICK))}
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
                    className={cx(Classes.HTML_TABLE, Classes.INTERACTIVE)}
                    style={{ width: '100%' }}
                  >
                    <tbody>
                      {data.notifications.items.map((notification) => (
                        <tr
                          key={notification.id}
                          className={css`
                            td {
                              border-bottom: 1px solid rgba(16, 22, 26, 0.15);
                            }
                            background-color: ${notification.readAt ? 'transparent' : '#cdecff'};
                          `}
                          onClick={this.handleNotificationClick(notification)}
                        >
                          <td>
                            {notification.content}
                            <br />
                            <small className={Classes.TEXT_MUTED}>
                              {distanceInWordsToNow(notification.createdAt, {
                                locale: dateFnsCsLocale,
                                addSuffix: true,
                              })}
                              {' — '}
                              {displayDateTime(notification.createdAt)}
                            </small>
                          </td>
                          <td>
                            <Button
                              type="button"
                              text={
                                notification.readAt
                                  ? 'Označit za nepřečtené'
                                  : 'Označit za přečtené'
                              }
                              className={css`
                                white-space: nowrap;
                              `}
                              onClick={() =>
                                notification.readAt
                                  ? this.markAsUnread(notification)
                                  : this.markAsRead(notification)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                      {data.notifications.totalCount > data.notifications.items.length && (
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
