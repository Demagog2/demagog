import * as React from 'react';

import { Button, Classes, Intent } from '@blueprintjs/core';
import { ApolloError } from 'apollo-client';
import { sortBy } from 'lodash';
import { Mutation, Query } from 'react-apollo';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import {
  GetUsersQuery,
  GetUsersQueryVariables,
  UpdateUsersRankInputType,
  UpdateUsersRankMutation,
  UpdateUsersRankMutationVariables,
} from '../operation-result-types';
import { UpdateUsersRank } from '../queries/mutations';
import { GetUsers } from '../queries/queries';
import { newlinesToBr } from '../utils';
import SpeakerAvatar from './SpeakerAvatar';

class UpdateUsersRankMutationComponent extends Mutation<
  UpdateUsersRankMutation,
  UpdateUsersRankMutationVariables
> {}

interface IUsersSortOnAboutUsPageProps {
  dispatch: Dispatch;
  users: GetUsersQuery['users'];
  isLoading: boolean;
}

interface IUsersSortOnAboutUsPageState {
  users: GetUsersQuery['users'];
}

class UsersSortOnAboutUsPage extends React.Component<
  IUsersSortOnAboutUsPageProps,
  IUsersSortOnAboutUsPageState
> {
  constructor(props: IUsersSortOnAboutUsPageProps) {
    super(props);

    this.state = {
      users: props.users,
    };
  }

  public componentDidUpdate(prevProps: IUsersSortOnAboutUsPageProps) {
    if (prevProps.users !== this.props.users) {
      this.setState({ users: this.props.users });
    }
  }

  public onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    this.setState({
      users: reorder(this.state.users, result.source.index, result.destination.index),
    });
  };

  public save = (updateUsersRank) => () => {
    const input: UpdateUsersRankInputType = {
      ordered_user_ids: this.state.users.map((s) => s.id),
    };

    updateUsersRank({ variables: { input } })
      .then(() => {
        this.props.dispatch(
          addFlashMessage('Řazení členů týmu na stránce „O nás“ úspěšně uloženo.', 'success'),
        );
      })
      .catch((error: ApolloError) => {
        this.props.dispatch(addFlashMessage('Při ukládání došlo k chybě.', 'error'));

        console.error(error); // tslint:disable-line:no-console
      });
  };

  public render() {
    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <div style={{ float: 'right' }}>
          <Link to="/admin/users" className={Classes.BUTTON}>
            Zpět na seznam členů týmu
          </Link>
          <UpdateUsersRankMutationComponent mutation={UpdateUsersRank}>
            {(updateSourceStatementsOrder, { loading }) => (
              <Button
                disabled={loading}
                intent={Intent.PRIMARY}
                style={{ marginLeft: 7 }}
                onClick={this.save(updateSourceStatementsOrder)}
                text={loading ? 'Ukládám …' : 'Uložit'}
              />
            )}
          </UpdateUsersRankMutationComponent>
        </div>

        <h2 className={Classes.HEADING}>Seřadit členy týmu na stránce „O nás“</h2>

        <p>Řazení upravte libovolně přetažením a potvrďte tlačítkem "Uložit".</p>

        <div style={{ marginTop: 15 }}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(droppableProvided) => (
                <div ref={droppableProvided.innerRef}>
                  {this.state.users.map((user, index) => (
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
                              first_name={user.first_name || ''}
                              last_name={user.last_name || ''}
                            />
                          </div>
                          <div style={{ flex: '1 1', marginLeft: 15 }}>
                            <h5 className={Classes.HEADING}>
                              {user.first_name} {user.last_name}
                            </h5>
                            <h6 className={Classes.HEADING}>{user.position_description}</h6>
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
}

const EnhancedUsersSortOnAboutUsPage = connect()(UsersSortOnAboutUsPage);

function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
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

class GetUsersQueryComponent extends Query<GetUsersQuery, GetUsersQueryVariables> {}

class UsersSortOnAboutUsPageContainer extends React.Component<{}> {
  public render() {
    return (
      <GetUsersQueryComponent query={GetUsers}>
        {({ data, loading }) => {
          let users: GetUsersQuery['users'] = [];
          if (data && data.users) {
            users = data.users.filter((u) => u.user_public);
            users = sortBy(users, 'rank');
          }

          return <EnhancedUsersSortOnAboutUsPage users={users} isLoading={loading} />;
        }}
      </GetUsersQueryComponent>
    );
  }
}

export default UsersSortOnAboutUsPageContainer;
