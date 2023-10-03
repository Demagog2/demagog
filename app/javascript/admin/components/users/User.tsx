import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { IconNames } from '@blueprintjs/icons';
import { Card, Colors, Classes, Button, Callout } from '@blueprintjs/core';
import SpeakerAvatar from '../SpeakerAvatar';
import Authorize from '../Authorize';
import { newlinesToBr } from '../../utils';
import type { GetUsers_users } from '../../operation-result-types';

interface IUserContainerProps {
  user: GetUsers_users;

  loading: boolean;
  onUpdateUserActiveness: (userActive: boolean) => void;
  onDeleteUser: () => void;
}

export function User(props: IUserContainerProps) {
  return (
    <Card
      style={{
        marginBottom: 15,
        backgroundColor: props.user.active ? 'none' : Colors.LIGHT_GRAY4,
      }}
    >
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '0 0 106px' }}>
          <SpeakerAvatar
            avatar={props.user.avatar}
            first_name={props.user.firstName || ''}
            last_name={props.user.lastName || ''}
          />
        </div>
        <div style={{ flex: '1 1', marginLeft: 15 }}>
          <Authorize permissions={['users:edit']}>
            <div
              style={{
                float: 'right',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Link
                to={`/admin/users/edit/${props.user.id}`}
                className={classNames(Classes.BUTTON, Classes.iconClass(IconNames.EDIT))}
              >
                Upravit
              </Link>
              {props.user.active
                ? (
                <Button
                  icon={IconNames.CROSS}
                  style={{ marginLeft: 7 }}
                  text="Deaktivovat"
                  disabled={props.loading}
                  onClick={() => { props.onUpdateUserActiveness(false); }}
                />
                  )
                : (
                <Button
                  icon={IconNames.TICK}
                  style={{ marginLeft: 7 }}
                  text="Aktivovat"
                  disabled={props.loading}
                  onClick={() => { props.onUpdateUserActiveness(true); }}
                />
                  )}
              <Button
                type="button"
                icon={IconNames.TRASH}
                style={{ marginLeft: 7 }}
                onClick={props.onDeleteUser}
                title="Smazat"
              />
            </div>
          </Authorize>

          <h5 className={Classes.HEADING}>
            {props.user.firstName} {props.user.lastName}
          </h5>

          <h6 className={Classes.HEADING}>{props.user.positionDescription}</h6>
          <p>{props.user.bio && newlinesToBr(props.user.bio)}</p>

          <Callout>
            <span className={Classes.TEXT_MUTED}>Email: </span>
            {props.user.email}
            <br />
            <span className={Classes.TEXT_MUTED}>Přístupová práva: </span>
            {props.user.role.name}
            <br />
            <span className={Classes.TEXT_MUTED}>Posílat upozornění emailem: </span>
            {props.user.emailNotifications ? 'Ano' : 'Ne'}
            <br />
            <span className={Classes.TEXT_MUTED}>Zobrazit v O nás:&nbsp;</span>
            {props.user.userPublic ? 'Ano' : 'Ne'}
          </Callout>
        </div>
      </div>
    </Card>
  );
}
