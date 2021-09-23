import * as React from 'react';

import { Button, Classes, Tab, Tabs } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { distanceInWordsToNow } from 'date-fns';
import * as dateFnsCsLocale from 'date-fns/locale/cs';
import { css, cx } from 'emotion';
import { groupBy } from 'lodash';
import { DateTime } from 'luxon';
import { Mutation, Query } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import apolloClient from '../apolloClient';
import {
  GetNotifications as GetNotificationsQuery,
  GetNotificationsVariables as GetNotificationsQueryVariables,
  MarkUnreadNotificationsAsRead as MarkUnreadNotificationsAsReadMutation,
  MarkUnreadNotificationsAsReadVariables as MarkUnreadNotificationsAsReadMutationVariables,
  UpdateNotificationVariables as UpdateNotificationMutationVariables,
} from '../operation-result-types';
import { MarkUnreadNotificationsAsRead, UpdateNotification } from '../queries/mutations';
import { GetNotifications } from '../queries/queries';
import { displayDateTime } from '../utils';
import Loading from './Loading';

interface IProps extends RouteComponentProps<{ tab: string | undefined }>, DispatchProp {}

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

    const statementUrl = `/admin/statements/${notification.statement.id}`;

    if (notification.readAt) {
      this.props.history.push(statementUrl);
    } else {
      this.markAsRead(notification).then(() => {
        this.props.history.push(statementUrl);
      });
    }
  };

  public handleUnreadStatementClick = (
    notifications: GetNotificationsQuery['notifications']['items'],
  ) => {
    const statementId = notifications[0].statement.id;

    const variables: MarkUnreadNotificationsAsReadMutationVariables = {
      statementId,
    };

    apolloClient
      .mutate({
        mutation: MarkUnreadNotificationsAsRead,
        variables,
        refetchQueries: [
          {
            query: GetNotifications,
            variables: { includeRead: false, limit: 0, offset: 0 },
          },
        ],
      })
      .then(() => {
        const statementUrl = `/admin/statements/${statementId}`;

        this.props.history.push(statementUrl);
      });
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

  public handleTabChange = (tabId: string) => {
    let url = '/admin/notifications';
    if (tabId === 'all') {
      url += '/all';
    }

    this.props.history.push(url);
  };

  public render() {
    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <div style={{ float: 'right' }}>
          <Mutation<
            MarkUnreadNotificationsAsReadMutation,
            MarkUnreadNotificationsAsReadMutationVariables
          >
            mutation={MarkUnreadNotificationsAsRead}
            variables={{ statementId: null }}
            refetchQueries={[
              // Reset unread notifications count in the header to zero
              {
                query: GetNotifications,
                variables: { includeRead: false, limit: 0, offset: 0 },
              },
              // Reset unread tab
              {
                query: GetNotifications,
                variables: { includeRead: false, limit: 100, offset: 0 },
              },
              // Reset all tab
              {
                query: GetNotifications,
                variables: { includeRead: true, limit: 20, offset: 0 },
              },
            ]}
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

        <Tabs
          animate={false}
          large
          onChange={this.handleTabChange}
          renderActiveTabPanelOnly
          selectedTabId={this.props.match.params.tab === 'all' ? 'all' : 'unread'}
        >
          <Tab
            id="unread"
            title="Nepřečtené"
            panel={
              <UnreadNotificationsPanel
                handleUnreadStatementClick={this.handleUnreadStatementClick}
              />
            }
          />
          <Tab
            id="all"
            title="Všechny"
            panel={
              <AllNotificationsPanel
                handleNotificationClick={this.handleNotificationClick}
                markAsRead={this.markAsRead}
                markAsUnread={this.markAsUnread}
              />
            }
          />
        </Tabs>
      </div>
    );
  }
}

export default connect()(withRouter(Notifications));

const UnreadNotificationsPanel = ({ handleUnreadStatementClick }) => {
  return (
    <div style={{ marginTop: 15 }}>
      <Query<GetNotificationsQuery, GetNotificationsQueryVariables>
        query={GetNotifications}
        variables={{ includeRead: false, offset: 0, limit: 100 }}
      >
        {({ data, loading, error }) => {
          if (loading || !data) {
            return <Loading />;
          }

          if (error) {
            console.error(error); // tslint:disable-line:no-console
            return null;
          }

          if (data.notifications.items.length === 0) {
            return (
              <div>
                <p>Vše přečteno!</p>
                <iframe
                  src="https://giphy.com/embed/9Jcw5pUQlgQLe5NonJ"
                  width="480"
                  height="480"
                  frameBorder="0"
                />
              </div>
            );
          }

          const notificationsByStatementId = groupBy(
            data.notifications.items,
            (n) => n.statement.id,
          );

          return (
            <table
              className={cx(Classes.HTML_TABLE, Classes.INTERACTIVE)}
              style={{ width: '100%' }}
            >
              <tbody>
                {Object.keys(notificationsByStatementId).map((statementId) => {
                  const notifications = notificationsByStatementId[statementId];
                  const statement = notifications[0].statement;

                  return (
                    <tr
                      key={statementId}
                      className={css`
                        td {
                          border-bottom: 1px solid rgba(16, 22, 26, 0.15);
                        }
                        background-color: #e6f5ff;
                      `}
                      onClick={() => handleUnreadStatementClick(notifications)}
                    >
                      <td style={{ width: '50%' }}>
                        <strong>
                          {statement.sourceSpeaker.firstName} {statement.sourceSpeaker.lastName}
                        </strong>
                        : {statement.content}
                        <br />
                        <small
                          className={cx(
                            Classes.TEXT_MUTED,
                            css`
                              margin-top: 10px;
                            `,
                          )}
                        >
                          Diskuze: {statement.source.name}
                        </small>
                      </td>
                      <td style={{ width: '50%' }}>
                        <table
                          className={cx(Classes.HTML_TABLE, Classes.HTML_TABLE_CONDENSED)}
                          style={{ width: '100%' }}
                        >
                          <tbody>
                            {notifications.map((notification) => (
                              <tr
                                key={notification.id}
                                className={css`
                                  td {
                                    border-bottom: 1px solid rgba(16, 22, 26, 0.15);
                                  }
                                `}
                              >
                                <td>
                                  {notification.statementText}
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
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          );
        }}
      </Query>
    </div>
  );
};

interface IAllNotificationsPanelProps {
  handleNotificationClick: (
    notification: GetNotificationsQuery['notifications']['items'][0],
  ) => (event: React.MouseEvent<Element>) => void;
  markAsRead: (notification: GetNotificationsQuery['notifications']['items'][0]) => void;
  markAsUnread: (notification: GetNotificationsQuery['notifications']['items'][0]) => void;
}

interface IAllNotificationsPanelState {
  isLoadingMore: boolean;
}

class AllNotificationsPanel extends React.Component<
  IAllNotificationsPanelProps,
  IAllNotificationsPanelState
> {
  public state = {
    isLoadingMore: false,
  };

  public render() {
    const { handleNotificationClick, markAsRead, markAsUnread } = this.props;

    return (
      <div style={{ marginTop: 15 }}>
        <Query<GetNotificationsQuery, GetNotificationsQueryVariables>
          query={GetNotifications}
          variables={{ includeRead: true, offset: 0, limit: 20 }}
        >
          {({ data, loading, error, fetchMore }) => {
            if (loading && (!data || !data.notifications)) {
              return <Loading />;
            }

            if (error) {
              console.error(error); // tslint:disable-line:no-console
              return null;
            }

            if (!data || !data.notifications) {
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
                          background-color: ${notification.readAt ? 'transparent' : '#e6f5ff'};
                        `}
                        onClick={handleNotificationClick(notification)}
                      >
                        <td>
                          {notification.fullText}
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
                              notification.readAt ? 'Označit za nepřečtené' : 'Označit za přečtené'
                            }
                            className={css`
                              white-space: nowrap;
                            `}
                            onClick={() =>
                              notification.readAt
                                ? markAsUnread(notification)
                                : markAsRead(notification)
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
        </Query>
      </div>
    );
  }
}
