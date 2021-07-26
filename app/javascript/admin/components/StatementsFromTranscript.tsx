/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { Button, Card, Classes, Intent } from '@blueprintjs/core';
import { Form, Formik } from 'formik';
import * as Immutable from 'immutable';
import { isEqual } from 'lodash';
import { DateTime } from 'luxon';
import * as queryString from 'query-string';
import { Mutation, Query } from 'react-apollo';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import * as yup from 'yup';

import * as Slate from 'slate';
import SlatePlainSerializer from 'slate-plain-serializer';
import { Editor, RenderMarkProps } from 'slate-react';

import { isAuthorized } from '../authorization';
import { STATEMENT_TYPES } from '../constants';
import {
  CreateStatement as CreateStatementMutation,
  CreateStatementInput,
  CreateStatementVariables as CreateStatementMutationVariables,
  GetSource as GetSourceQuery,
  GetSourceStatements as GetSourceStatementsQuery,
  GetSourceStatementsVariables as GetSourceStatementsQueryVariables,
  StatementType,
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
      <Query<GetSourceQuery>
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
                  {source.medium?.name} ze dne{' '}
                  {source.releasedAt ? displayDate(source.releasedAt) : 'neuvedeno'}
                  {source.mediaPersonalities && source.mediaPersonalities.length > 0 && (
                    <>, {source.mediaPersonalities.map((p) => p.name).join(' & ')}</>
                  )}
                  {source.sourceUrl && (
                    <>
                      , <a href={source.sourceUrl}>odkaz</a>
                    </>
                  )}
                  {source.experts?.length && (
                    <>
                      <br />
                      Editoři:{' '}
                      {source.experts
                        .map((expert) => `${expert.firstName} ${expert.lastName}`)
                        .join(', ')}
                    </>
                  )}
                </span>
              </div>

              {this.renderTranscriptWithStatements(source)}
            </div>
          );
        }}
      </Query>
    );
  }

  public renderTranscriptWithStatements(source) {
    const { newStatementSelection, selectedStatements, transcriptSelection } = this.state;

    const canAddStatements = this.props.isAuthorized(['statements:add']);

    return (
      <Query<GetSourceStatementsQuery, GetSourceStatementsQueryVariables>
        query={GetSourceStatements}
        variables={{ sourceId: parseInt(source.id, 10), includeUnpublished: true }}
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
            (s) => s.statementTranscriptPosition !== null,
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

            if (highlightStatement && highlightStatement.statementTranscriptPosition) {
              startCursor = {
                line: highlightStatement.statementTranscriptPosition.startLine,
                offset: highlightStatement.statementTranscriptPosition.startOffset,
              };
            }
          }

          return (
            <div style={{ flex: '1 0', display: 'flex', marginTop: 30, overflowY: 'hidden' }}>
              <div
                style={{
                  flex: '1 0',
                  overflowY: 'auto',
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
              <div style={{ flex: '1 0', overflowY: 'auto', marginLeft: 15, paddingBottom: 50 }}>
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

                {canAddStatements && newStatementSelection !== null && (
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
      </Query>
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
      statement_type: StatementType.factual,
      content: selection.text,
      speaker_id: source.speakers[0].id,
      note: '',
      evaluator_id: null,
    };

    return (
      <Mutation<CreateStatementMutation, CreateStatementMutationVariables>
        mutation={CreateStatement}
      >
        {(createStatement) => (
          <Formik
            initialValues={initialValues}
            validationSchema={yup.object().shape({
              content: yup.string().required('Je třeba vyplnit znění výroku'),
            })}
            onSubmit={(values, { setSubmitting }) => {
              const note = values.note.trim();

              const statementInput: CreateStatementInput = {
                statementType: values.statement_type,
                content: values.content,
                speakerId: values.speaker_id,
                sourceId: source.id,
                important: false,
                published: false,
                excerptedAt: DateTime.utc().toISO(),
                assessment: {
                  evaluatorId: values.evaluator_id,
                },
                statementTranscriptPosition: {
                  startLine: selection.startLine,
                  startOffset: selection.startOffset,
                  endLine: selection.endLine,
                  endOffset: selection.endOffset,
                },
                firstCommentContent: note !== '' ? note : null,
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
                    <div style={{ display: 'flex' }}>
                      <div style={{ flex: '1 1' }}>
                        <FormGroup label="Řečník" name="speaker_id">
                          <SelectField
                            name="speaker_id"
                            options={source.speakers.map((s) => ({
                              label: `${s.firstName} ${s.lastName}`,
                              value: s.id,
                            }))}
                          />
                        </FormGroup>
                      </div>
                      <div style={{ flex: '1 1' }}>
                        <FormGroup label="Typ výroku" name="statement_type">
                          <SelectField name="statement_type" options={STATEMENT_TYPE_OPTIONS} />
                        </FormGroup>
                      </div>
                    </div>
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
      </Mutation>
    );
  }
}

interface ITranscriptTextProps {
  onSelectedStatementsChange: (selectedStatements: string[]) => void;
  onSelectionChange: (selection: null | ITranscriptSelection) => void;
  selectedStatements: string[];
  statements: GetSourceStatementsQuery['statements'];
  transcript: string;
  newStatementSelection: null | ITranscriptSelection;
  startCursor: { line: number; offset: number } | null;
}

interface ITranscriptTextState {
  value: Slate.Value;
}

class TranscriptText extends React.Component<ITranscriptTextProps, ITranscriptTextState> {
  public editor: Slate.Editor;

  constructor(props: ITranscriptTextProps) {
    super(props);

    let value = deserializeTranscript(props.transcript);

    value = addMarksFromStatements(value, props.statements, props.selectedStatements);

    this.state = {
      value,
    };
  }

  public componentDidMount() {
    if (this.props.startCursor !== null) {
      const startCursor = this.props.startCursor;

      // We first move cursor to the end, let the editor render and then move
      // the cursor to the specified start cursor. This way we make sure that
      // the start cursor is at the top of the scroll window and user won't
      // miss it.
      this.editor.command('moveToEndOfDocument');
      setTimeout(() => {
        const blocks = this.editor.value.document.getBlocks();

        if (blocks) {
          const block = blocks.find((b) => (b ? b.data.get('line') === startCursor.line : false));

          if (block) {
            this.editor.command('moveToStartOfNode', block);
            this.editor.command('moveForward', startCursor.offset);
          }
        }
      }, 0);
    }
  }

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
        let value = this.state.value;
        value = highlightNewStatementSelection(value, this.props.newStatementSelection);
        value = addMarksFromStatements(value, this.props.statements, this.props.selectedStatements);
        this.setState({ value });
      });
    }
  }

  public onChange = (change: {
    operations: Immutable.List<Slate.Operation>;
    value: Slate.Value;
  }) => {
    this.setState({ value: change.value }, () => {
      const value = this.state.value;
      if (!value.selection.anchor.key || !value.selection.focus.key) {
        return;
      }
      const selectionText = SlatePlainSerializer.serialize(value.set('document', value.fragment));
      const anchorBlock = value.document.getClosestBlock(value.selection.anchor.key);
      const focusBlock = value.document.getClosestBlock(value.selection.focus.key);
      if (!anchorBlock || !focusBlock) {
        return;
      }
      let startLine = anchorBlock.data.get('line');
      let startOffset = value.selection.anchor.offset;
      let endLine = focusBlock.data.get('line');
      let endOffset = value.selection.focus.offset;
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
      if (value.selection.isFocused && selectionText !== '') {
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
          if (statement.statementTranscriptPosition) {
            const position = statement.statementTranscriptPosition;
            return (
              position.startLine <= cursorLine &&
              (position.startLine === cursorLine ? position.startOffset <= cursorOffset : true) &&
              position.endLine >= cursorLine &&
              (position.endLine === cursorLine ? position.endOffset >= startOffset : true)
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

  public onKeyDown = () => {
    // By not calling next() here, we prevent the user from changing the transcript
  };

  public render() {
    const { value } = this.state;

    return (
      <Editor
        ref={(editor) => editor && (this.editor = editor.controller)}
        autoFocus
        value={value}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        renderMark={this.renderMark}
      />
    );
  }

  public renderMark = (props: RenderMarkProps) => {
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
  const valueJSON = SlatePlainSerializer.deserialize(transcript, { toJSON: true });

  // Add line numbers to data of line block nodes
  valueJSON.document.nodes.forEach((node, index) => {
    node.data.line = index;
  });

  // Initialize decorations to empty list
  valueJSON.decorations = [];

  return Slate.Value.fromJSON(valueJSON);
};

const addMarksFromStatements = (
  value: Slate.Value,
  statements: any[],
  selectedIds: string[],
): Slate.Value => {
  let decorations = value.decorations || Immutable.List();
  decorations = removeDecorationsWithMarkType(decorations, 'statement-');

  statements.forEach((statement: any) => {
    if (statement.statementTranscriptPosition) {
      const position = statement.statementTranscriptPosition;

      const startInlineNode = findInlineNodeByLineNumber(value.document, position.startLine);
      const endInlineNode = findInlineNodeByLineNumber(value.document, position.endLine);

      decorations = decorations.push(
        Slate.Decoration.fromJSON({
          anchor: {
            key: startInlineNode.key,
            offset: position.startOffset,
            object: 'point',
          },
          focus: {
            key: endInlineNode.key,
            offset: position.endOffset,
            object: 'point',
          },
          mark: {
            object: 'mark',
            type: `statement-${statement.id}`,
            data: { selected: selectedIds.includes(statement.id) },
          },
        }),
      );
    }
  });

  return Slate.Value.create({
    document: value.document,
    selection: value.selection,
    data: value.data,
    decorations,
  });
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
  value: Slate.Value,
  newStatementSelection: ITranscriptSelection | null,
): Slate.Value => {
  let decorations = value.decorations || Immutable.List();
  decorations = removeDecorationsWithMarkType(decorations, 'new-statement');

  if (newStatementSelection !== null) {
    const startInlineNode = findInlineNodeByLineNumber(
      value.document,
      newStatementSelection.startLine,
    );
    const endInlineNode = findInlineNodeByLineNumber(value.document, newStatementSelection.endLine);

    decorations = decorations.push(
      Slate.Decoration.fromJSON({
        anchor: {
          key: startInlineNode.key,
          offset: newStatementSelection.startOffset,
          object: 'point',
        },
        focus: {
          key: endInlineNode.key,
          offset: newStatementSelection.endOffset,
          object: 'point',
        },
        mark: {
          object: 'mark',
          type: 'new-statement',
        },
      }),
    );
  }

  return Slate.Value.create({
    document: value.document,
    selection: value.selection,
    data: value.data,
    decorations,
  });
};

const removeDecorationsWithMarkType = (
  decorations: Immutable.List<Slate.Decoration>,
  markTypeStartsWith: string,
): Immutable.List<Slate.Decoration> => {
  return decorations.filter((decoration) => {
    if (!decoration || !decoration.mark) {
      return false;
    }

    return !decoration.mark.type.startsWith(markTypeStartsWith);
  }) as Immutable.List<Slate.Decoration>;
};

const STATEMENT_TYPE_OPTIONS = Object.keys(STATEMENT_TYPES).map((statementType) => ({
  label: STATEMENT_TYPES[statementType],
  value: statementType,
}));

const mapStateToProps = (state: ReduxState) => ({
  isAuthorized: isAuthorized(state.currentUser.user),
});

export default connect(mapStateToProps)(StatementsFromTranscript);
