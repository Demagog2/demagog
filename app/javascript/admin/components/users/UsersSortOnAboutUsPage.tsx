import * as React from 'react';

import { Button, Classes, Intent } from '@blueprintjs/core';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';

import { GetUsers as GetUsersQuery } from '../../operation-result-types';
import { newlinesToBr } from '../../utils';
import { reorder } from '../../utils/array';
import SpeakerAvatar from '../SpeakerAvatar';
import { useState, useEffect, useCallback } from 'react';

interface IUsersSortOnAboutUsPageProps {
  users: GetUsersQuery['users'];
  isLoading: boolean;
  isSaving: boolean;
  onSave(users: GetUsersQuery['users']): void;
}

export function UsersSortOnAboutUsPage(props: IUsersSortOnAboutUsPageProps) {
  const [users, setUsers] = useState(props.users);

  useEffect(() => setUsers(props.users), [props.users]);

  const onDragEnd = useCallback(
    (result) => {
      // dropped outside the list
      if (!result.destination) {
        return;
      }

      setUsers(reorder(users, result.source.index, result.destination.index));
    },
    [setUsers, users],
  );

  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      <div style={{ float: 'right' }}>
        <Link to="/admin/users" className={Classes.BUTTON}>
          Zpět na seznam členů týmu
        </Link>
        <Button
          disabled={props.isSaving}
          intent={Intent.PRIMARY}
          style={{ marginLeft: 7 }}
          onClick={() => props.onSave(users)}
          text={props.isSaving ? 'Ukládám …' : 'Uložit'}
        />
      </div>

      <h2 className={Classes.HEADING}>Seřadit členy týmu na stránce „O nás“</h2>

      <p>Řazení upravte libovolně přetažením a potvrďte tlačítkem "Uložit".</p>

      <div style={{ marginTop: 15 }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(droppableProvided) => (
              <div ref={droppableProvided.innerRef}>
                {users.map((user, index) => (
                  <Draggable key={user.id} draggableId={user.id} index={index}>
                    {(draggableProvided, draggableSnapshot) => (
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                        style={getItemStyle(
                          draggableSnapshot.isDragging,
                          draggableProvided.draggableProps.style,
                        )}
                      >
                        <div style={{ flex: '0 0 106px' }}>
                          <SpeakerAvatar
                            avatar={user.avatar}
                            first_name={user.firstName || ''}
                            last_name={user.lastName || ''}
                          />
                        </div>
                        <div style={{ flex: '1 1', marginLeft: 15 }}>
                          <h5 className={Classes.HEADING}>
                            {user.firstName} {user.lastName}
                          </h5>
                          <h6 className={Classes.HEADING}>{user.positionDescription}</h6>
                          <p>{user.bio && newlinesToBr(user.bio)}</p>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: 10,
  margin: '0 0 8px 0',
  border: '1px solid #ced4da',
  borderRadius: '.25rem',
  display: 'flex',
  background: 'white',
  boxShadow: isDragging ? '0 0 5px #bbb' : 'none',

  ...draggableStyle,
});
