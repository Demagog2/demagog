import React from 'react';
import type { ApolloError } from 'apollo-client';
import type { GetUsers } from '../../operation-result-types';
import { Classes, Switch, NonIdealState } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import * as classNames from 'classnames';
import { css } from 'emotion';
import { Link } from 'react-router-dom';

import Authorize from '../Authorize';
import { SearchInput } from '../forms/controls/SearchInput';
import Loading from '../Loading';
import { UserContainer } from './UserContainer';

interface IUsersPageProps {
  users?: GetUsers;
  loading: boolean;
  error?: ApolloError;

  includeInactive: boolean;
  onIncludeInactiveChange: (includeInactive: boolean) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

function UsersEditorControls() {
  return (
    <Authorize permissions={['users:edit']}>
      <div style={{ float: 'right' }}>
        <Link className={Classes.BUTTON} to="/admin/users/sort-on-about-us-page" role="button">
          Seřadit na stránce „O nás“
        </Link>
        <Link
          className={classNames(
            Classes.BUTTON,
            Classes.INTENT_PRIMARY,
            Classes.iconClass(IconNames.PLUS),
            css`
              margin-left: 7px;
            `,
          )}
          to="/admin/users/new"
          role="button"
        >
          Přidat nového člena týmu
        </Link>
      </div>
    </Authorize>
  );
}

function UsersList(props: IUsersPageProps) {
  if (props.loading) {
    return <Loading />;
  }

  if (props.error) {
    return <NonIdealState title="Došlo k chybě při načítání uživatelů" />;
  }

  return (
    <div style={{ marginTop: 15 }}>
      {props.users?.users.map((user) => (
        <UserContainer key={user.id} user={user} />
      ))}

      {props.users?.users.length === 0 && props.search !== '' && (
        <p>Nenašli jsme žádného člena týmu se jménem „{props.search}“.</p>
      )}
    </div>
  );
}

export function UsersPage(props: IUsersPageProps) {
  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      <UsersEditorControls />

      <h2 className={Classes.HEADING}>Tým</h2>

      <div style={{ marginTop: 15 }}>
        <Switch
          checked={props.includeInactive}
          label="Zobrazit i deaktivované členy"
          onChange={(evt) => { props.onIncludeInactiveChange(evt.currentTarget.checked); }}
        />
        <SearchInput
          placeholder="Hledat dle jména…"
          value={props.search}
          onChange={props.onSearchChange}
        />
      </div>

      <UsersList {...props} />
    </div>
  );
}
