import * as React from 'react';

import { Position, Switch, Tooltip } from '@blueprintjs/core';
import { ApolloError } from 'apollo-client';
import * as classNames from 'classnames';
import { Formik } from 'formik';
import { Mutation, Query } from 'react-apollo';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import {
  ASSESSMENT_STATUS_APPROVAL_NEEDED,
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_BEING_EVALUATED,
  ASSESSMENT_STATUS_LABELS,
} from '../constants';
import {
  GetStatementQuery,
  UpdateStatementInputType,
  UpdateStatementMutation,
  UpdateStatementMutationVariables,
} from '../operation-result-types';
import { UpdateStatement } from '../queries/mutations';
import { GetStatement } from '../queries/queries';
import { displayDate } from '../utils';
import UserSelect from './forms/controls/UserSelect';
import VeracitySelect from './forms/controls/VeracitySelect';
import FormikAutoSave from './forms/FormikAutoSave';
import Loading from './Loading';

class UpdateStatementMutationComponent extends Mutation<
  UpdateStatementMutation,
  UpdateStatementMutationVariables
> {}

class GetStatementQueryComponent extends Query<GetStatementQuery> {}

interface IProps extends RouteComponentProps<{ id: string }> {
  dispatch: (action: any) => any;
}

class StatementDetail extends React.Component<IProps> {
  public savedMessageTimeoutId: number | null = null;

  public render() {
    const statementId = this.props.match.params.id;

    return (
      <GetStatementQueryComponent
        query={GetStatement}
        variables={{ id: parseInt(statementId, 10) }}
        pollInterval={5000}
      >
        {({ data, loading, error }) => {
          if (error) {
            console.error(error); // tslint:disable-line:no-console
          }

          if (loading) {
            return <Loading />;
          }

          if (!data) {
            return null;
          }

          const statement = data.statement;

          const initialValues = {
            published: statement.published,
            assessment: {
              evaluation_status: statement.assessment.evaluation_status,
              veracity_id: statement.assessment.veracity ? statement.assessment.veracity.id : null,
              short_explanation: statement.assessment.short_explanation,
              evaluator_id: statement.assessment.evaluator
                ? statement.assessment.evaluator.id
                : null,
            },
          };

          return (
            <UpdateStatementMutationComponent mutation={UpdateStatement}>
              {(updateStatement) => (
                <Formik
                  initialValues={initialValues}
                  enableReinitialize
                  onSubmit={(values, { setSubmitting, setStatus, resetForm }) => {
                    const statementInput: UpdateStatementInputType = {};

                    // TODO: generalize
                    if (initialValues.assessment.veracity_id !== values.assessment.veracity_id) {
                      statementInput.assessment = statementInput.assessment || {};
                      statementInput.assessment.veracity_id = values.assessment.veracity_id;
                    }

                    if (
                      initialValues.assessment.short_explanation !==
                      values.assessment.short_explanation
                    ) {
                      statementInput.assessment = statementInput.assessment || {};
                      statementInput.assessment.short_explanation =
                        values.assessment.short_explanation;
                    }

                    if (initialValues.assessment.evaluator_id !== values.assessment.evaluator_id) {
                      statementInput.assessment = statementInput.assessment || {};
                      statementInput.assessment.evaluator_id = values.assessment.evaluator_id;
                    }

                    if (
                      initialValues.assessment.evaluation_status !==
                      values.assessment.evaluation_status
                    ) {
                      statementInput.assessment = statementInput.assessment || {};
                      statementInput.assessment.evaluation_status =
                        values.assessment.evaluation_status;
                    }

                    if (initialValues.published !== values.published) {
                      statementInput.published = values.published;
                    }

                    updateStatement({
                      variables: { id: parseInt(statement.id, 10), statementInput },
                    })
                      .then(() => {
                        setSubmitting(false);

                        setStatus('saved');
                        if (this.savedMessageTimeoutId !== null) {
                          window.clearTimeout(this.savedMessageTimeoutId);
                        }
                        this.savedMessageTimeoutId = window.setTimeout(() => {
                          setStatus(null);
                          this.savedMessageTimeoutId = null;
                        }, 5000);
                      })
                      .catch((mutationError: ApolloError) => {
                        setSubmitting(false);
                        resetForm();

                        this.props.dispatch(
                          addFlashMessage(
                            'Nepodařilo se uložit tvoji poslední změnu, zkus to prosím znovu',
                          ),
                        );
                        console.error(mutationError); // tslint:disable-line:no-console
                      });
                  }}
                >
                  {({
                    handleChange,
                    handleBlur,
                    values,
                    setFieldValue,
                    setFieldTouched,
                    submitForm,
                    isSubmitting,
                    status,
                  }) => (
                    <div style={{ marginTop: 15 }}>
                      <FormikAutoSave debounceWait={1000} submitForm={submitForm} values={values} />
                      <div className="float-right">
                        <Link
                          to={`/admin/sources/${statement.source.id}`}
                          className="btn btn-secondary"
                        >
                          Zpět na zdroj výroku
                        </Link>
                      </div>

                      <h3>Detail výroku</h3>

                      {!status && !isSubmitting && <div>Změny jsou ukládány automaticky</div>}

                      {status &&
                        status === 'saved' &&
                        !isSubmitting && <div>Změny úspěšně uloženy</div>}

                      {isSubmitting && <div>Ukládám změny ...</div>}

                      <div style={{ display: 'flex', marginTop: 30, marginBottom: 30 }}>
                        <div style={{ flex: '2 0' }}>
                          <h5>
                            {statement.speaker.first_name} {statement.speaker.last_name}
                          </h5>
                          <p>{statement.content}</p>
                          <p className="text-muted">
                            Zdroj: {statement.source.medium.name},{' '}
                            {displayDate(statement.source.released_at)},{' '}
                            {statement.source.media_personality.name}
                            {statement.source.source_url && (
                              <>
                                , <a href={statement.source.source_url}>odkaz</a>
                              </>
                            )}
                          </p>

                          <hr
                            style={{ borderTop: '2px solid #ccc', marginTop: 30, marginBottom: 30 }}
                          />

                          <div className="form-group row">
                            <label htmlFor="veracity" className="col-sm-4 col-form-label">
                              Hodnocení
                            </label>
                            <div className="col-sm-8">
                              <VeracitySelect
                                onChange={(value) => setFieldValue('assessment.veracity_id', value)}
                                onBlur={() => setFieldTouched('assessment.veracity_id')}
                                value={values.assessment.veracity_id}
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label htmlFor="assessment-short-explanation" className="form-label">
                              Odůvodnění zkráceně
                            </label>
                            <textarea
                              className="form-control"
                              id="assessment-short-explanation"
                              name="assessment.short_explanation"
                              rows={3}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.assessment.short_explanation || ''}
                            />
                            <small className="form-text text-muted">
                              Maximálně na dlouhý tweet, tj. 280 znaků
                            </small>
                          </div>
                          <div className="form-group">
                            <label htmlFor="explanation" className="form-label">
                              Odůvodnění
                            </label>
                            <textarea className="form-control" id="explanation" rows={5} />
                          </div>
                        </div>

                        <div style={{ flex: '1 0', marginLeft: 15 }}>
                          <div className="form-group row">
                            <label htmlFor="status" className="col-sm-4 col-form-label">
                              Stav
                            </label>
                            <div className="col-sm-8">
                              <EvaluationStatusInput
                                disabled={statement.published}
                                value={values.assessment.evaluation_status}
                                onChange={(value) =>
                                  setFieldValue('assessment.evaluation_status', value)
                                }
                              />
                            </div>
                          </div>
                          <div className="form-group row">
                            <label htmlFor="evaluator" className="col-sm-4 col-form-label">
                              Ověřovatel/ka
                            </label>
                            <div className="col-sm-8">
                              {/* TODO: add tooltip to explain when the user select is disabled? */}
                              <UserSelect
                                disabled={
                                  statement.assessment.evaluation_status !==
                                  ASSESSMENT_STATUS_BEING_EVALUATED
                                }
                                onChange={(value) =>
                                  setFieldValue('assessment.evaluator_id', value)
                                }
                                onBlur={() => setFieldTouched('assessment.evaluator_id')}
                                value={values.assessment.evaluator_id}
                              />
                            </div>
                          </div>
                          <div className="form-group row">
                            <label htmlFor="published" className="col-sm-4 col-form-label">
                              Zvěřejněný
                            </label>
                            <div className="col-sm-8" style={{ paddingTop: 8 }}>
                              <Tooltip
                                disabled={
                                  statement.assessment.evaluation_status ===
                                  ASSESSMENT_STATUS_APPROVED
                                }
                                content="Aby šel výrok zveřejnit, musí být ve schváleném stavu"
                                position={Position.TOP}
                              >
                                <Switch
                                  name="published"
                                  checked={values.published}
                                  onChange={handleChange}
                                  large
                                  inline
                                  style={{ margin: 0 }}
                                  disabled={
                                    statement.assessment.evaluation_status !==
                                    ASSESSMENT_STATUS_APPROVED
                                  }
                                />
                              </Tooltip>
                            </div>
                          </div>
                          <hr style={{ borderTop: '2px solid #ccc' }} />
                          <p>TODO: stitky a dulezity</p>
                          <hr style={{ borderTop: '2px solid #ccc' }} />
                          <p>TODO: komentare</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Formik>
              )}
            </UpdateStatementMutationComponent>
          );
        }}
      </GetStatementQueryComponent>
    );
  }
}

interface IEvaluationStatusInputProps {
  disabled: boolean;
  value: string;
  onChange: (value: string) => void;
}

class EvaluationStatusInput extends React.Component<IEvaluationStatusInputProps> {
  public onChange = (value: string) => () => {
    if (!this.props.disabled) {
      this.props.onChange(value);
    }
  };

  public render() {
    const { disabled, value } = this.props;

    return (
      <>
        <input
          type="text"
          readOnly
          className="form-control-plaintext"
          id="status"
          value={ASSESSMENT_STATUS_LABELS[value]}
        />

        {value === ASSESSMENT_STATUS_BEING_EVALUATED && (
          <button
            type="button"
            className={classNames('btn', 'btn-outline-secondary', { disabled })}
            onClick={this.onChange(ASSESSMENT_STATUS_APPROVAL_NEEDED)}
          >
            Posunout ke kontrole
          </button>
        )}

        {value === ASSESSMENT_STATUS_APPROVAL_NEEDED && (
          <>
            <button
              type="button"
              className={classNames('btn', 'btn-outline-secondary', { disabled })}
              onClick={this.onChange(ASSESSMENT_STATUS_BEING_EVALUATED)}
            >
              Vrátit ke zpracování
            </button>
            <button
              type="button"
              className={classNames('btn', 'btn-outline-secondary', { disabled })}
              onClick={this.onChange(ASSESSMENT_STATUS_APPROVED)}
            >
              Schválit
            </button>
          </>
        )}

        {value === ASSESSMENT_STATUS_APPROVED && (
          <Tooltip
            disabled={!disabled}
            content="Aby šel výrok vrátit ke zpracování, nesmí být zveřejněný"
            position={Position.TOP}
          >
            <button
              type="button"
              className={classNames('btn', 'btn-outline-secondary', { disabled })}
              onClick={this.onChange(ASSESSMENT_STATUS_BEING_EVALUATED)}
            >
              Vrátit ke zpracování
            </button>
          </Tooltip>
        )}
      </>
    );
  }
}

export default connect()(StatementDetail);
