/* eslint jsx-a11y/anchor-has-content: 0, jsx-a11y/anchor-is-valid: 0 */

import * as React from 'react';

import { Formik } from 'formik';
import { List } from 'immutable';
import { isEqual } from 'lodash';
import { DateTime } from 'luxon';
import { Mutation, Query } from 'react-apollo';
import { Link, RouteComponentProps } from 'react-router-dom';

import * as Slate from 'slate';
import Plain from 'slate-plain-serializer';
import { Editor } from 'slate-react';

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
import { displayDate, pluralize } from '../utils';
import UserSelect from './forms/controls/UserSelect';
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

interface IProps extends RouteComponentProps<{ sourceId: string }> {}

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

  // tslint:disable-next-line:member-ordering
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
                height: 'calc(100vh - 55px)',
                marginTop: 7,
              }}
            >
              <div>
                <div className="float-right">
                  <Link to={`/admin/sources/${source.id}`} className="btn btn-secondary">
                    Zpět na detail zdroje
                  </Link>
                </div>

                <h3>{source.name}</h3>
                <span>
                  {source.medium.name}, {displayDate(source.released_at)},{' '}
                  {source.media_personality.name}
                  {source.source_url && (
                    <>
                      , <a href={source.source_url}>odkaz</a>
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

          return (
            <div style={{ flex: '1 0', display: 'flex', marginTop: 30 }}>
              <div
                style={{
                  flex: '1 0',
                  overflow: 'scroll',
                  marginRight: 15,
                  paddingRight: 15,
                }}
              >
                <h5>Přepis:</h5>
                {source.transcript && (
                  <TranscriptText
                    onSelectedStatementsChange={this.onSelectedStatementsChange}
                    onSelectionChange={this.onSelectionChange}
                    selectedStatements={selectedStatements}
                    statements={statementsWithPositions}
                    transcript={source.transcript}
                    newStatementSelection={newStatementSelection}
                  />
                )}
              </div>
              <div style={{ flex: '1 0', overflow: 'scroll', marginLeft: 15 }}>
                {transcriptSelection === null &&
                  newStatementSelection === null && (
                    <>
                      {statementsWithPositions.length === 0 && (
                        <p>
                          Začněte označením části přepisu, ze které chcete vytvořit první výrok.
                        </p>
                      )}

                      {statementsWithPositions.length > 0 && (
                        <>
                          {selectedStatements.length === 0 && (
                            <>
                              <h5>
                                {statementsWithPositions.length}
                                {pluralize(
                                  statementsWithPositions.length,
                                  ' výrok',
                                  ' výroky',
                                  ' výroků',
                                )}
                              </h5>
                              <p>
                                Klikněte do označené části v přepisu k zobrazení pouze výroku k ní
                                se vztahujícího. Pokud chcete vytvořit nový výrok, označte část
                                přepisu, ze které jej chcete vytvořit.
                              </p>
                            </>
                          )}

                          {statementsToDisplay.map((statement) => (
                            <StatementCard
                              key={statement.id}
                              onDeleted={() => {
                                refetch({ sourceId: parseInt(source.id, 10) });
                              }}
                              statement={statement}
                            />
                          ))}
                        </>
                      )}
                    </>
                  )}

                {transcriptSelection !== null &&
                  newStatementSelection === null && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onMouseDown={this.onCreateStatementMouseDown}
                    >
                      Vytvořit výrok z označené části přepisu
                    </button>
                  )}

                {newStatementSelection !== null && (
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
            // TODO: some validation?
            // validate={(values) => {
            //   // same as above, but feel free to move this into a class method now.
            //   let errors = {};
            //   if (!values.email) {
            //     errors.email = 'Required';
            //   } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            //     errors.email = 'Invalid email address';
            //   }
            //   return errors;
            // }}
            onSubmit={(values, { setSubmitting }) => {
              const statementInput: CreateStatementInputType = {
                content: values.content,
                speaker_id: values.speaker_id,
                source_id: source.id,
                important: false,
                published: false,
                count_in_statistics: false,
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
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              setFieldTouched,
            }) => (
              <form onSubmit={handleSubmit}>
                <div className="card">
                  <div className="card-header">
                    <div className="float-right" style={{ margin: '-3px 0' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={onRequestClose}
                      >
                        Zrušit
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm"
                        style={{ marginLeft: 10 }}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Ukládám ...' : 'Uložit'}
                      </button>
                    </div>

                    <h5 style={{ margin: 0 }}>Nový výrok</h5>
                  </div>
                  <div className="card-body">
                    <div className="form-group">
                      <label htmlFor="content">Znění</label>
                      <textarea
                        className="form-control"
                        id="content"
                        name="content"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.content}
                        rows={5}
                        autoFocus
                      />
                      {touched.content && errors.content && <div>{errors.content}</div>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="speaker_id">Řečník</label>
                      <select
                        className="form-control"
                        id="speaker_id"
                        name="speaker_id"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.speaker_id}
                      >
                        {source.speakers.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.first_name} {s.last_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* <div className="form-group">
                      <label>Štítky</label>
                      <p>TODO</p>
                    </div> */}
                    {/* <div className="form-group">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="important"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.important}
                          id="important"
                        />
                        <label className="form-check-label" htmlFor="important">
                          Důležitý výrok
                        </label>
                      </div>
                    </div> */}
                    <div className="form-group">
                      <label>Ověřovatel:</label>
                      <UserSelect
                        onChange={(value) => setFieldValue('evaluator_id', value)}
                        onBlur={() => setFieldTouched('evaluator_id')}
                        value={values.evaluator_id}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="note">Poznámka pro ověřování</label>
                      <textarea
                        className="form-control"
                        id="note"
                        name="note"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.note}
                        rows={3}
                      />
                      <small className="form-text text-muted">
                        Bude přidána jako první komentář v diskuzi k výroku.
                      </small>
                    </div>
                  </div>
                </div>
              </form>
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
}

interface ITranscriptTextState {
  value: Slate.Value;
}

class TranscriptText extends React.Component<ITranscriptTextProps, ITranscriptTextState> {
  constructor(props: ITranscriptTextProps) {
    super(props);

    let value = deserializeTranscript(props.transcript);
    value = addMarksFromStatements(value.change(), props.statements, props.selectedStatements)
      .value;

    this.state = {
      value,
    };
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

export default StatementsFromTranscript;
