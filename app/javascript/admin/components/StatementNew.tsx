import * as React from 'react';

import { Mutation, Query } from '@apollo/client/react/components';
import { Classes } from '@blueprintjs/core';
import * as classNames from 'classnames';
import { Form, Formik } from 'formik';
import { DateTime } from 'luxon';
import { connect, DispatchProp } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import * as yup from 'yup';

import { addFlashMessage } from '../actions/flashMessages';
import { STATEMENT_TYPES } from '../constants';
import {
  CreateStatement as CreateStatementMutation,
  CreateStatementInput,
  CreateStatementVariables as CreateStatementMutationVariables,
  GetSource as GetSourceQuery,
  GetSourceVariables as GetSourceQueryVariables,
  StatementType,
} from '../operation-result-types';
import { CreateStatement } from '../queries/mutations';
import { GetSource, GetSourceStatements } from '../queries/queries';
import SelectComponentField from './forms/controls/SelectComponentField';
import SelectField from './forms/controls/SelectField';
import TextareaField from './forms/controls/TextareaField';
import UserSelect from './forms/controls/UserSelect';
import FormGroup from './forms/FormGroup';
import Loading from './Loading';

interface IProps extends RouteComponentProps<{ sourceId: string }>, DispatchProp {}

// tslint:disable-next-line:max-classes-per-file
class StatementNew extends React.Component<IProps> {
  public onCompleted = (sourceId: string) => {
    this.props.dispatch(addFlashMessage('Výrok byl úspěšně přidán.', 'success'));
    this.props.history.push(`/admin/sources/${sourceId}`);
  };

  public onError = (error: any) => {
    this.props.dispatch(addFlashMessage('Při ukládání došlo k chybě.', 'error'));

    console.error(error); // tslint:disable-line:no-console
  };

  public render() {
    return (
      <Query<GetSourceQuery, GetSourceQueryVariables>
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

          const initialValues = {
            statement_type: StatementType.factual,
            content: '',
            source_speaker_id: source.sourceSpeakers?.length ? source.sourceSpeakers[0].id : null,
            evaluator_id: null,
            note: '',
          };

          return (
            <Mutation<CreateStatementMutation, CreateStatementMutationVariables>
              mutation={CreateStatement}
              refetchQueries={[
                {
                  query: GetSourceStatements,
                  variables: { sourceId: parseInt(source.id, 10), includeUnpublished: true },
                },
              ]}
            >
              {(createStatement) => (
                <Formik
                  initialValues={initialValues}
                  validationSchema={yup.object().shape({
                    content: yup.string().required('Je třeba vyplnit znění výroku'),
                    source_speaker_id: yup.mixed().notOneOf([null, ''], 'Je třeba vybrat řečníka'),
                  })}
                  onSubmit={(values, { setSubmitting }) => {
                    const note = values.note.trim();

                    const statementInput: CreateStatementInput = {
                      statementType: values.statement_type,
                      content: values.content,
                      sourceSpeakerId: values.source_speaker_id ?? '',
                      sourceId: source.id,
                      important: false,
                      published: false,
                      excerptedAt: DateTime.utc().toISO(),
                      assessment: {
                        evaluatorId: values.evaluator_id,
                      },
                      firstCommentContent: note !== '' ? note : null,
                    };

                    createStatement({ variables: { statementInput } })
                      .then(() => {
                        setSubmitting(false);
                        this.onCompleted(source.id);
                      })
                      .catch((error) => {
                        setSubmitting(false);
                        // TODO setErrors() ?;
                        this.onError(error);
                      });
                  }}
                >
                  {({ isSubmitting }) => (
                    <div style={{ padding: '15px 0 40px 0' }}>
                      <Form>
                        <div style={{ float: 'right' }}>
                          <Link to={`/admin/sources/${source.id}`} className={Classes.BUTTON}>
                            Zpět na diskuzi
                          </Link>
                          <button
                            type="submit"
                            className={classNames(Classes.BUTTON, Classes.INTENT_PRIMARY)}
                            style={{ marginLeft: 7 }}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Ukládám…' : 'Uložit'}
                          </button>
                        </div>

                        <h2 className={Classes.HEADING}>Přidat nový výrok</h2>

                        <div style={{ display: 'flex', marginTop: 30 }}>
                          <div style={{ flex: '0 0 200px', marginRight: 15 }}>
                            <h4 className={Classes.HEADING}>Výrok</h4>
                          </div>
                          <div style={{ flex: '1 1' }}>
                            <FormGroup label="Znění" name="content">
                              <TextareaField
                                name="content"
                                placeholder="Vložte či vepište znění…"
                                rows={7}
                              />
                            </FormGroup>
                            <div style={{ display: 'flex' }}>
                              <div style={{ flex: '1 1' }}>
                                <FormGroup label="Řečník" name="source_speaker_id">
                                  <SelectField
                                    name="source_speaker_id"
                                    options={
                                      source.sourceSpeakers?.map((s) => ({
                                        label: `${s.firstName} ${s.lastName}`,
                                        value: s.id,
                                      })) ?? []
                                    }
                                  />
                                </FormGroup>
                              </div>
                              <div style={{ flex: '1 1' }}>
                                <FormGroup label="Typ výroku" name="statement_type">
                                  <SelectField
                                    name="statement_type"
                                    options={STATEMENT_TYPE_OPTIONS}
                                  />
                                </FormGroup>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', marginTop: 30 }}>
                          <div style={{ flex: '0 0 200px', marginRight: 15 }}>
                            <h4 className={Classes.HEADING}>Ověřování</h4>
                          </div>
                          <div style={{ flex: '1 1' }}>
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
                        </div>
                      </Form>
                    </div>
                  )}
                </Formik>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

const STATEMENT_TYPE_OPTIONS = Object.keys(STATEMENT_TYPES).map((statementType) => ({
  label: STATEMENT_TYPES[statementType],
  value: statementType,
}));

export default connect()(withRouter(StatementNew));
