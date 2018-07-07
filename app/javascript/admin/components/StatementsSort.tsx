import * as React from 'react';

import { Button, Classes, Intent } from '@blueprintjs/core';
import { ApolloError } from 'apollo-client';
import { Mutation, Query } from 'react-apollo';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link, withRouter } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import {
  GetSourceQuery,
  GetSourceQueryVariables,
  GetSourceStatementsQuery,
  GetSourceStatementsQueryVariables,
  UpdateSourceStatementsOrderInputType,
  UpdateSourceStatementsOrderMutation,
  UpdateSourceStatementsOrderMutationVariables,
} from '../operation-result-types';
import { UpdateSourceStatementsOrder } from '../queries/mutations';
import { GetSource, GetSourceStatements } from '../queries/queries';
import { newlinesToBr } from '../utils';
import Loading from './Loading';

class UpdateSourceStatementsOrderMutationComponent extends Mutation<
  UpdateSourceStatementsOrderMutation,
  UpdateSourceStatementsOrderMutationVariables
> {}

interface ISource {
  id: string;
  name: string;
}

interface IStatement {
  id: string;
  content: string;
  speaker: {
    first_name: string;
    last_name: string;
  };
}

interface IProps {
  source: ISource;
  statements: IStatement[];
  dispatch: Dispatch;
  onCompleted: () => void;
}

interface IState {
  statements: IStatement[];
  isSubmitting: boolean;
}

class StatementsSort extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      statements: props.statements,
      isSubmitting: false,
    };
  }

  public onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const statements = reorder(
      this.state.statements,
      result.source.index,
      result.destination.index,
    );

    this.setState({
      statements,
    });
  };

  public save = (updateSourceStatementsOrder) => () => {
    const input: UpdateSourceStatementsOrderInputType = {
      ordered_statement_ids: this.state.statements.map((s) => s.id),
    };

    this.setState({ isSubmitting: true });

    updateSourceStatementsOrder({ variables: { id: this.props.source.id, input } })
      .then(() => {
        this.setState({ isSubmitting: false });
        this.props.dispatch(addFlashMessage('Aktuální řazení výroků úspěšně uloženo.', 'success'));
        this.props.onCompleted();
      })
      .catch((error: ApolloError) => {
        this.setState({ isSubmitting: false });
        this.props.dispatch(addFlashMessage('Při ukládání došlo k chybě.', 'error'));

        console.error(error); // tslint:disable-line:no-console
      });
  };

  public render() {
    return (
      <div style={{ padding: '15px 0 40px 0' }}>
        <div style={{ float: 'right' }}>
          <Link to={`/admin/sources/${this.props.source.id}`} className={Classes.BUTTON}>
            Zpět na zdroj výroků
          </Link>
          <UpdateSourceStatementsOrderMutationComponent mutation={UpdateSourceStatementsOrder}>
            {(updateSourceStatementsOrder) => (
              <Button
                disabled={this.state.isSubmitting}
                intent={Intent.PRIMARY}
                style={{ marginLeft: 7 }}
                onClick={this.save(updateSourceStatementsOrder)}
                text={this.state.isSubmitting ? 'Ukládám ...' : 'Uložit'}
              />
            )}
          </UpdateSourceStatementsOrderMutationComponent>
        </div>

        <h2>Seřadit výroky ze zdroje {this.props.source.name}</h2>

        <div style={{ marginTop: 30 }}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="droppable">
              {(droppableProvided) => (
                <div ref={droppableProvided.innerRef}>
                  {this.state.statements.map((statement, index) => (
                    <Draggable key={statement.id} draggableId={statement.id} index={index}>
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
                          <div style={{ flex: '1 0' }}>
                            <h5>
                              {statement.speaker.first_name} {statement.speaker.last_name}
                            </h5>
                          </div>
                          <div style={{ flex: '2 0' }}>{newlinesToBr(statement.content)}</div>
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

const EnhancedStatementsSort = connect()(StatementsSort);

class GetSourceQueryComponent extends Query<GetSourceQuery, GetSourceQueryVariables> {}

class GetSourceStatementsQueryComponent extends Query<
  GetSourceStatementsQuery,
  GetSourceStatementsQueryVariables
> {}

interface IStatementsSortContainerProps extends RouteComponentProps<{ sourceId: string }> {}

class StatementsSortContainer extends React.Component<IStatementsSortContainerProps> {
  public render() {
    return (
      <GetSourceQueryComponent
        query={GetSource}
        variables={{ id: parseInt(this.props.match.params.sourceId, 10) }}
      >
        {({ data: sourceData, loading: sourceLoading }) => (
          <GetSourceStatementsQueryComponent
            query={GetSourceStatements}
            variables={{ sourceId: parseInt(this.props.match.params.sourceId, 10) }}
          >
            {({ data: statementsData, loading: statementsLoading, refetch: statementsRefetch }) => {
              if (sourceLoading || statementsLoading) {
                return <Loading />;
              }

              if (!sourceData || !statementsData) {
                return null;
              }

              return (
                <EnhancedStatementsSort
                  source={sourceData.source}
                  statements={statementsData.statements}
                  onCompleted={() => {
                    statementsRefetch({ sourceId: parseInt(this.props.match.params.sourceId, 10) });
                  }}
                />
              );
            }}
          </GetSourceStatementsQueryComponent>
        )}
      </GetSourceQueryComponent>
    );
  }
}

export default withRouter(StatementsSortContainer);
