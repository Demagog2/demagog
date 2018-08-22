/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { Button, Card, Classes, Intent } from '@blueprintjs/core';
import { Form, Formik } from 'formik';
import { List } from 'immutable';
import { isEqual } from 'lodash';
import { DateTime } from 'luxon';
import * as queryString from 'query-string';
import { Mutation, Query } from 'react-apollo';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import * as yup from 'yup';

import * as Slate from 'slate';
import Plain from 'slate-plain-serializer';
import { Editor } from 'slate-react';

import { isAuthorized } from '../authorization';
import {
  CreateStatementInputType,
  CreateStatementMutation,
  CreateStatementMutationVariables,
  GetSourceQuery,
  GetSourceStatementsQuery,
  GetSourceStatementsQueryVariables,
} from '../operation-result-types';
import { CreateStatement } from '../queries/mutations';
import { GetSource, GetSourceStatements } from '../queries/queries';
import { IState as ReduxState } from '../reducers';
import { displayDate, pluralize } from '../utils';
import Authorize from './Authorize';
import SelectComponentField from './forms/controls/SelectComponentField';
import SelectField from './forms/controls/SelectField';
import TextareaField from './forms/controls/TextareaField';
import UserSelect from './forms/controls/UserSelect';
import FormGroup from './forms/FormGroup';
import Loading from './Loading';
import StatementCard from './StatementCard';

class GetSourceQueryComponent extends Query<GetSourceQuery> {}

class GetSourceStatementsQueryComponent extends Query<
  GetSourceStatementsQuery,
  GetSourceStatementsQueryVariables
> {}

class CreateStatementMutationComponent extends Mutation<
  CreateStatementMutation,
  CreateStatementMutationVariables
> {}

interface ITranscriptSelection {
  text: string;
  startLine: number;
  startOffset: number;
  endLine: number;
  endOffset: number;
}

interface IProps extends RouteComponentProps<{ sourceId: string }> {
  isAuthorized: (permissions: string[]) => boolean;
}

interface IState {
  transcriptSelection: ITranscriptSelection | null;
  newStatementSelection: ITranscriptSelection | null;
  selectedStatements: string[];
}

class StatementsFromTranscript extends React.Component<IProps, IState> {
  public transcriptContainer: Node | null = null;

  constructor(props) {
    super(props);

    this.state = {
      transcriptSelection: null,
      newStatementSelection: null,
      selectedStatements: [],
    };
  }

  public onCreateStatementMouseDown = () => {
    const { transcriptSelection } = this.state;

    if (transcriptSelection === null) {
      return;
    }

    this.setState({ newStatementSelection: transcriptSelection });
  };

  public closeNewStatementForm = () => {
    this.setState({ newStatementSelection: null });
  };

  public onSelectionChange = (transcriptSelection: ITranscriptSelection | null) => {
    this.setState({ transcriptSelection });
  };

  public onSelectedStatementsChange = (selectedStatements: string[]) => {
    this.setState({ selectedStatements });
  };

  public render() {
    return (
      <GetSourceQueryComponent
        query={GetSource}
        variables={{ id: parseInt(this.props.match.params.sourceId, 10) }}
      >
        {({ data, loading }) => {
          if (loading) {
            return <Loading />;
          }

          if (!data) {
            return null;
          }

          const source = data.source;

          return (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100vh - 65px)',
                paddingTop: 15,
              }}
            >
              <div>
                <div style={{ float: 'right' }}>
                  <Link to={`/admin/sources/${source.id}`} className={Classes.BUTTON}>
                    Zpět na diskuzi
                  </Link>
                </div>

                <h2 className={Classes.HEADING}>{source.name}</h2>

                <span>
                  {source.medium.name}, {displayDate(source.released_at)},{' '}
                  {source.media_personality.name}
                  {source.source_url && (
                    <>
                      , <a href={source.source_url}>odkaz</a>
                    </>
                  )}
                  {source.expert && (
                    <>
                      <br />
                      Expert: {source.expert.first_name} {source.expert.last_name}
                    </>
                  )}
                </span>
              </div>

              {this.renderTranscriptWithStatements(source)}
            </div>
          );
        }}
      </GetSourceQueryComponent>
    );
  }

  public renderTranscriptWithStatements(source) {
    const { newStatementSelection, selectedStatements, transcriptSelection } = this.state;

    const canAddStatements = this.props.isAuthorized(['statements:add']);

    return (
      <GetSourceStatementsQueryComponent
        query={GetSourceStatements}
        variables={{ sourceId: parseInt(source.id, 10) }}
      >
        {({ data, loading, refetch }) => {
          if (!data || !data.statements) {
            if (loading) {
              return <Loading />;
            }

            return null;
          }

          const statements = data.statements;

          const statementsWithPositions = statements.filter(
            (s) => s.statement_transcript_position !== null,
          );

          let statementsToDisplay = statementsWithPositions;
          if (selectedStatements.length > 0) {
            statementsToDisplay = statementsToDisplay.filter((s) =>
              selectedStatements.includes(s.id),
            );
          }

          let startCursor: { line: number; offset: number } | null = null;
          const queryParams = queryString.parse(this.props.location.search);
          if (queryParams.highlightStatementId) {
            const highlightStatement = statementsWithPositions.find(
              (s) => s.id === queryParams.highlightStatementId,
            );

            if (highlightStatement && highlightStatement.statement_transcript_position) {
              startCursor = {
                line: highlightStatement.statement_transcript_position.start_line,
                offset: highlightStatement.statement_transcript_position.start_offset,
              };
            }
          }

          return (
            <div style={{ flex: '1 0', display: 'flex', marginTop: 30 }}>
              <div
                style={{
                  flex: '1 0',
                  overflow: 'scroll',
                  marginRight: 15,
                  paddingRight: 15,
                  paddingBottom: 50,
                }}
              >
                <h5 className={Classes.HEADING}>Přepis:</h5>
                {source.transcript && (
                  <TranscriptText
                    onSelectedStatementsChange={this.onSelectedStatementsChange}
                    onSelectionChange={this.onSelectionChange}
                    selectedStatements={selectedStatements}
                    statements={statementsWithPositions}
                    transcript={source.transcript}
                    newStatementSelection={newStatementSelection}
                    startCursor={startCursor}
                  />
                )}
              </div>
              <div style={{ flex: '1 0', overflow: 'scroll', marginLeft: 15, paddingBottom: 50 }}>
                {(!canAddStatements ||
                  (transcriptSelection === null && newStatementSelection === null)) && (
                  <>
                    {statementsWithPositions.length === 0 && (
                      <p>Začněte označením části přepisu, ze které chcete vytvořit první výrok.</p>
                    )}

                    {statementsWithPositions.length > 0 && (
                      <>
                        {selectedStatements.length === 0 && (
                          <>
                            <h5 className={Classes.HEADING}>
                              {statementsWithPositions.length}
                              {pluralize(
                                statementsWithPositions.length,
                                ' výrok',
                                ' výroky',
                                ' výroků',
                              )}
                            </h5>
                            <p>
                              Klikněte do označené části v přepisu k zobrazení pouze výroku k ní se
                              vztahujícího.{' '}
                              <Authorize permissions={['statements:add']}>
                                Pokud chcete vytvořit nový výrok, označte část přepisu, ze které jej
                                chcete vytvořit.
                              </Authorize>
                            </p>
                          </>
                        )}

                        <div style={{ marginTop: 20 }}>
                          {statementsToDisplay.map((statement) => (
                            <div
                              style={{
                                // 1px margin so there is enough space for the card box-shadow
                                margin: 1,
                              }}
                              key={statement.id}
                            >
                              <StatementCard
                                onDeleted={() => {
                                  refetch({ sourceId: parseInt(source.id, 10) });
                                }}
                                statement={statement}
                              />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}

                {canAddStatements &&
                  transcriptSelection !== null &&
                  newStatementSelection === null && (
                    <Button
                      intent={Intent.PRIMARY}
                      large
                      onMouseDown={this.onCreateStatementMouseDown}
                      text="Vytvořit výrok z označené části přepisu"
                    />
                  )}

                {canAddStatements &&
                  newStatementSelection !== null && (
                    <NewStatementForm
                      onStatementCreated={() => {
                        refetch({ sourceId: parseInt(source.id, 10) });
                        this.closeNewStatementForm();
                      }}
                      onRequestClose={this.closeNewStatementForm}
                      selection={newStatementSelection}
                      source={source}
                    />
                  )}
              </div>
            </div>
          );
        }}
      </GetSourceStatementsQueryComponent>
    );
  }
}

interface INewStatementFormProps {
  onRequestClose: () => void;
  onStatementCreated: () => void;
  selection: ITranscriptSelection;
  source: any;
}

class NewStatementForm extends React.Component<INewStatementFormProps> {
  public render() {
    const { onRequestClose, onStatementCreated, selection, source } = this.props;

    const initialValues = {
      content: selection.text,
      speaker_id: source.speakers[0].id,
      note: '',
      evaluator_id: null,
    };

    return (
      <CreateStatementMutationComponent mutation={CreateStatement}>
        {(createStatement) => (
          <Formik
            initialValues={initialValues}
            validationSchema={yup.object().shape({
              content: yup.string().required('Je třeba vyplnit znění výroku'),
            })}
            onSubmit={(values, { setSubmitting }) => {
              const note = values.note.trim();

              const statementInput: CreateStatementInputType = {
                content: values.content,
                speaker_id: values.speaker_id,
                source_id: source.id,
                important: false,
                published: false,
                count_in_statistics: true,
                excerpted_at: DateTime.utc().toISO(),
                assessment: {
                  evaluator_id: values.evaluator_id,
                },
                statement_transcript_position: {
                  start_line: selection.startLine,
                  start_offset: selection.startOffset,
                  end_line: selection.endLine,
                  end_offset: selection.endOffset,
                },
                first_comment_content: note !== '' ? note : null,
              };

              createStatement({ variables: { statementInput } })
                .then(() => {
                  setSubmitting(false);
                  onStatementCreated();
                })
                .catch((error) => {
                  setSubmitting(false);
                  // TODO setErrors();

                  console.error(error); // tslint:disable-line:no-console
                });
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Card
                  style={{
                    // 1px margin so there is enough space for the card box-shadow
                    margin: 1,
                  }}
                >
                  <div style={{ float: 'right', margin: '-3px 0' }}>
                    <Button onClick={onRequestClose} text="Zrušit" />
                    <Button
                      type="submit"
                      intent={Intent.PRIMARY}
                      style={{ marginLeft: 7 }}
                      disabled={isSubmitting}
                      text={isSubmitting ? 'Ukládám ...' : 'Uložit'}
                    />
                  </div>

                  <h5 className={Classes.HEADING}>Nový výrok</h5>

                  <div style={{ marginTop: 20 }}>
                    <FormGroup label="Znění" name="content">
                      <TextareaField name="content" rows={5} autoFocus />
                    </FormGroup>
                    <FormGroup label="Řečník" name="speaker_id">
                      <SelectField
                        name="speaker_id"
                        options={source.speakers.map((s) => ({
                          label: `${s.first_name} ${s.last_name}`,
                          value: s.id,
                        }))}
                      />
                    </FormGroup>
                    <FormGroup label="Ověřovatel" name="evaluator_id" optional>
                      <SelectComponentField name="evaluator_id">
                        {(renderProps) => <UserSelect {...renderProps} />}
                      </SelectComponentField>
                    </FormGroup>
                    <FormGroup
                      label="Poznámka pro ověřování"
                      name="note"
                      helperText="Bude přidána jako první komentář v diskuzi k výroku."
                      optional
                    >
                      <TextareaField name="note" rows={4} />
                    </FormGroup>
                  </div>
                </Card>
              </Form>
            )}
          </Formik>
        )}
      </CreateStatementMutationComponent>
    );
  }
}

interface ITranscriptTextProps {
  onSelectedStatementsChange: (selectedStatements: string[]) => void;
  onSelectionChange: (selection: null | ITranscriptSelection) => void;
  selectedStatements: string[];
  statements: any[];
  transcript: string;
  newStatementSelection: null | ITranscriptSelection;
  startCursor: { line: number; offset: number } | null;
}

interface ITranscriptTextState {
  value: Slate.Value;
}

class TranscriptText extends React.Component<ITranscriptTextProps, ITranscriptTextState> {
  constructor(props: ITranscriptTextProps) {
    super(props);

    let change = deserializeTranscript(props.transcript).change();

    change = addMarksFromStatements(change, props.statements, props.selectedStatements);

    if (props.startCursor !== null) {
      // We first move cursor to the end, let the editor render and then move
      // the cursor to the specified start cursor. This way we make sure that
      // the start cursor is at the top of the scroll window and user won't
      // miss it.
      change = moveToEnd(change);
      setTimeout(this.moveToStartCursor, 0);
    }

    this.state = {
      value: change.value,
    };
  }

  public moveToStartCursor = () => {
    if (this.props.startCursor) {
      this.onChange(moveToStartCursor(this.state.value.change(), this.props.startCursor));
    }
  };

  public componentDidUpdate(prevProps) {
    if (
      !isEqual(this.props.newStatementSelection, prevProps.newStatementSelection) ||
      !isEqual(this.props.selectedStatements, prevProps.selectedStatements) ||
      !isEqual(this.props.statements, prevProps.statements)
    ) {
      // Don't know why, but I need to delay the state change with
      // requestAnimationFrame here, otherwise the change of Slate value
      // does not happen
      requestAnimationFrame(() => {
        let change = this.state.value.change();

        change = highlightNewStatementSelection(change, this.props.newStatementSelection);
        change = addMarksFromStatements(
          change,
          this.props.statements,
          this.props.selectedStatements,
        );

        this.onChange(change);
      });
    }
  }

  public onChange = (change: Slate.Change) => {
    this.setState({ value: change.value }, () => {
      const value = this.state.value;

      if (!value.selection.anchorKey || !value.selection.focusKey) {
        return;
      }

      const selectionText = Plain.serialize(value.set('document', value.fragment));

      const anchorBlock = value.document.getClosestBlock(value.selection.anchorKey);
      const focusBlock = value.document.getClosestBlock(value.selection.focusKey);

      if (!anchorBlock || !focusBlock) {
        return;
      }

      let startLine = anchorBlock.data.get('line');
      let startOffset = value.selection.anchorOffset;

      let endLine = focusBlock.data.get('line');
      let endOffset = value.selection.focusOffset;

      // Anchor and focus are according to the start and end of user's selection,
      // so we need to sort them by line and offset if we want to always have the
      // start before end
      if (startLine > endLine) {
        [startLine, endLine] = [endLine, startLine];
        [startOffset, endOffset] = [endOffset, startOffset];
      }
      if (startOffset > endOffset) {
        [startOffset, endOffset] = [endOffset, startOffset];
      }

      if (value.isFocused && selectionText !== '') {
        this.props.onSelectionChange({
          text: selectionText,
          startLine,
          startOffset,
          endLine,
          endOffset,
        });
      } else {
        this.props.onSelectionChange(null);
      }

      if (selectionText === '') {
        const cursorLine = startLine;
        const cursorOffset = startOffset;

        const selectedStatements = this.props.statements.filter((statement) => {
          if (statement.statement_transcript_position) {
            const position = statement.statement_transcript_position;

            return (
              position.start_line <= cursorLine &&
              (position.start_line === cursorLine ? position.start_offset <= cursorOffset : true) &&
              position.end_line >= cursorLine &&
              (position.end_line === cursorLine ? position.end_offset >= startOffset : true)
            );
          }

          return false;
        });

        this.props.onSelectedStatementsChange(selectedStatements.map((statement) => statement.id));
      } else {
        this.props.onSelectedStatementsChange([]);
      }
    });
  };

  public onKeyDown = (event: Event) => {
    // By this we prevent the user from changing the transcript
    event.preventDefault();
    return true;
  };

  public render() {
    const { value } = this.state;

    return (
      <Editor
        autoFocus
        value={value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderMark={this.renderMark}
      />
    );
  }

  public renderMark = (props) => {
    const { children, mark, attributes } = props;

    if ((mark.type as string).startsWith('statement-')) {
      let backgroundColor = 'rgba(255, 217, 20, 0.38)';

      if (mark.data.get('selected')) {
        backgroundColor = 'rgba(255, 162, 20, 0.38)';
      }

      return (
        <span {...attributes} style={{ backgroundColor }}>
          {children}
        </span>
      );
    }

    switch (mark.type) {
      case 'new-statement':
        return (
          <span {...attributes} style={{ backgroundColor: 'rgba(96, 255, 22, 0.38)' }}>
            {children}
          </span>
        );
    }
  };
}

const deserializeTranscript = (transcript: string): Slate.Value => {
  const valueJSON = Plain.deserialize(transcript, { toJSON: true });

  // Add line numbers to data of line block nodes
  valueJSON.document.nodes.forEach((node, index) => {
    node.data.line = index;
  });

  // Initialize decorations to empty list
  valueJSON.decorations = [];

  return Slate.Value.fromJSON(valueJSON);
};

const addMarksFromStatements = (
  change: Slate.Change,
  statements: any[],
  selectedIds: string[],
): Slate.Change => {
  let decorations = change.value.decorations || List();
  decorations = removeDecorationsWithMarkType(decorations, 'statement-');

  statements.forEach((statement: any) => {
    if (statement.statement_transcript_position) {
      const position = statement.statement_transcript_position;

      const startInlineNode = findInlineNodeByLineNumber(
        change.value.document,
        position.start_line,
      );
      const endInlineNode = findInlineNodeByLineNumber(change.value.document, position.end_line);

      decorations = decorations.push(
        Slate.Range.fromJSON({
          anchorKey: startInlineNode.key,
          anchorOffset: position.start_offset,
          focusKey: endInlineNode.key,
          focusOffset: position.end_offset,
          marks: [
            {
              type: `statement-${statement.id}`,
              data: { selected: selectedIds.includes(statement.id) },
            },
          ],
        }),
      );
    }
  });

  return change.setValue({ decorations });
};

const moveToEnd = (change: Slate.Change): Slate.Change => {
  const blocks = change.value.document.getBlocks();

  if (blocks) {
    change = (change as any).moveToEndOf(blocks.last());
  }

  return change;
};

const moveToStartCursor = (
  change: Slate.Change,
  startCursor: { line: number; offset: number },
): Slate.Change => {
  const blocks = change.value.document.getBlocks();

  if (blocks) {
    blocks.forEach((block) => {
      if (block && block.data.get('line') === startCursor.line) {
        change = (change as any).moveToStartOf(block).move(startCursor.offset);
      }
    });
  }

  return change;
};

const findInlineNodeByLineNumber = (document: Slate.Document, line: number): Slate.Inline => {
  const nodes = document.filterDescendants(
    (node: Slate.Node) => node.object === 'block' && node.data.get('line') === line,
  );

  if (nodes.size !== 1) {
    throw new Error();
  }

  const block = nodes.first() as Slate.Block;

  return block.nodes.first() as Slate.Inline;
};

const highlightNewStatementSelection = (
  change: Slate.Change,
  newStatementSelection: ITranscriptSelection | null,
): Slate.Change => {
  let decorations = change.value.decorations || List();
  decorations = removeDecorationsWithMarkType(decorations, 'new-statement');

  if (newStatementSelection !== null) {
    const startInlineNode = findInlineNodeByLineNumber(
      change.value.document,
      newStatementSelection.startLine,
    );
    const endInlineNode = findInlineNodeByLineNumber(
      change.value.document,
      newStatementSelection.endLine,
    );

    decorations = decorations.push(
      Slate.Range.fromJSON({
        anchorKey: startInlineNode.key,
        anchorOffset: newStatementSelection.startOffset,
        focusKey: endInlineNode.key,
        focusOffset: newStatementSelection.endOffset,
        marks: [{ type: 'new-statement' }],
      }),
    );
  }

  return change.setValue({ decorations });
};

const removeDecorationsWithMarkType = (
  decorations: List<Slate.Range>,
  markTypeStartsWith: string,
): List<Slate.Range> => {
  return decorations.filter((decoration) => {
    if (!decoration || !decoration.marks) {
      return false;
    }

    return !!decoration.marks.find(
      (mark) => (mark ? !mark.type.startsWith(markTypeStartsWith) : false),
    );
  }) as List<Slate.Range>;
};

const mapStateToProps = (state: ReduxState) => ({
  isAuthorized: isAuthorized(state.currentUser.user),
});

export default connect(mapStateToProps)(StatementsFromTranscript);
