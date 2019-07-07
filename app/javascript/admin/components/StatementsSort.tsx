import * as React from 'react';

import { Button, Classes, Intent } from '@blueprintjs/core';
import { ApolloError } from 'apollo-client';
import { Mutation, Query } from 'react-apollo';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link, withRouter } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import {
  GetSource as GetSourceQuery,
  GetSourceStatements as GetSourceStatementsQuery,
  GetSourceStatementsVariables as GetSourceStatementsQueryVariables,
  GetSourceVariables as GetSourceQueryVariables,
  UpdateSourceStatementsOrder as UpdateSourceStatementsOrderMutation,
  UpdateSourceStatementsOrderInput,
  UpdateSourceStatementsOrderVariables as UpdateSourceStatementsOrderMutationVariables,
} from '../operation-result-types';
import { UpdateSourceStatementsOrder } from '../queries/mutations';
import { GetSource, GetSourceStatements } from '../queries/queries';
import { newlinesToBr } from '../utils';
import { reorder } from '../utils/array';
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
    firstName: string;
    lastName: string;
  };
}

interface IProps extends DispatchProp {
  source: ISource;
  statements: IStatement[];
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
    const input: UpdateSourceStatementsOrderInput = {
      orderedStatementIds: this.state.statements.map((s) => s.id),
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
            Zpět na diskuzi
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

        <h2 className={Classes.HEADING}>Seřadit výroky z diskuze {this.props.source.name}</h2>

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
                            <h5 className={Classes.HEADING}>
                              {statement.speaker.firstName} {statement.speaker.lastName}
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
            variables={{
              sourceId: parseInt(this.props.match.params.sourceId, 10),
              includeUnpublished: true,
            }}
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
