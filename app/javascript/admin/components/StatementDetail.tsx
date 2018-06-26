import * as React from 'react';

import { Position, Switch, Tooltip } from '@blueprintjs/core';
import { ApolloError } from 'apollo-client';
import * as classNames from 'classnames';
import { Formik } from 'formik';
import { get, isEqual, set } from 'lodash';
import { Mutation, Query } from 'react-apollo';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import { isAuthorized } from '../authorization';
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
import { IState as ReduxState } from '../reducers';
import { displayDate, newlinesToBr } from '../utils';
import UserSelect from './forms/controls/UserSelect';
import VeracitySelect from './forms/controls/VeracitySelect';
import FormikAutoSave from './forms/FormikAutoSave';
import Loading from './Loading';
import RichTextEditor from './RichTextEditor';
import StatementComments from './StatementComments';

class UpdateStatementMutationComponent extends Mutation<
  UpdateStatementMutation,
  UpdateStatementMutationVariables
> {}

class GetStatementQueryComponent extends Query<GetStatementQuery> {}

interface IProps extends RouteComponentProps<{ id: string }> {
  currentUser: ReduxState['currentUser']['user'];
  dispatch: (action: any) => any;
  isAuthorized: (permissions: string[]) => boolean;
}

interface IState {
  isEditing: boolean;
}

class StatementDetail extends React.Component<IProps, IState> {
  public savedMessageTimeoutId: number | null = null;
  public isEditingTimeoutId: number | null = null;

  public state: IState = {
    isEditing: false,
  };

  public componentWillUnmount() {
    if (this.savedMessageTimeoutId !== null) {
      window.clearTimeout(this.savedMessageTimeoutId);
    }

    if (this.isEditingTimeoutId !== null) {
      window.clearTimeout(this.isEditingTimeoutId);
    }
  }

  public onFormEdit = () => {
    this.setState({ isEditing: true });

    if (this.isEditingTimeoutId !== null) {
      window.clearTimeout(this.isEditingTimeoutId);
    }

    this.isEditingTimeoutId = window.setTimeout(() => {
      this.setState({ isEditing: false });
      this.isEditingTimeoutId = null;
    }, 10000);
  };

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
            _isEditing: false,
            content: statement.content,
            published: statement.published,
            important: statement.important,
            assessment: {
              evaluation_status: statement.assessment.evaluation_status,
              veracity_id: statement.assessment.veracity ? statement.assessment.veracity.id : null,
              short_explanation: statement.assessment.short_explanation,
              explanation_html: statement.assessment.explanation_html,
              explanation_slatejson: statement.assessment.explanation_slatejson,
              evaluator_id: statement.assessment.evaluator
                ? statement.assessment.evaluator.id
                : null,
            },
          };
          let enableReinitialize = true;

          if (this.state.isEditing) {
            // When user is editing, we don't let formik reinitialize values,
            // so users do not lose anything they are writing. But after he's
            // done editing (no change in 10s), we let formik reinitialize with
            // latest values and use the _isEditing field to do change in
            // initialValues so resetForm is triggered in formik's
            // componentDidUpdate.
            initialValues._isEditing = true;
            enableReinitialize = false;
          }

          return (
            <UpdateStatementMutationComponent mutation={UpdateStatement}>
              {(updateStatement) => (
                <Formik
                  initialValues={initialValues}
                  enableReinitialize={enableReinitialize}
                  onSubmit={(values, { setSubmitting, setStatus, resetForm }) => {
                    this.onFormEdit();

                    const statementInput: UpdateStatementInputType = {};

                    const paths = [
                      'assessment.veracity_id',
                      'assessment.short_explanation',
                      'assessment.evaluator_id',
                      'assessment.evaluation_status',
                      'assessment.explanation_slatejson',
                      'assessment.explanation_html',
                      'published',
                      'content',
                      'important',
                    ];

                    paths.forEach((path) => {
                      if (!isEqual(get(initialValues, path), get(values, path))) {
                        set(statementInput, path, get(values, path));
                      }
                    });

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
                  }) => {
                    const canEditEverything = this.props.isAuthorized(['statements:edit']);
                    const canEditAsEvaluator =
                      values.assessment.evaluator_id !== null &&
                      this.props.currentUser !== null &&
                      this.props.currentUser.id === values.assessment.evaluator_id &&
                      this.props.isAuthorized(['statements:edit-as-evaluator']);
                    const canEditTexts = this.props.isAuthorized(['statements:edit-texts']);

                    const isApproved =
                      values.assessment.evaluation_status === ASSESSMENT_STATUS_APPROVED;
                    const isBeingEvaluated =
                      values.assessment.evaluation_status === ASSESSMENT_STATUS_BEING_EVALUATED;
                    const isApprovalNeeded =
                      values.assessment.evaluation_status === ASSESSMENT_STATUS_APPROVAL_NEEDED;

                    const canEditStatementContent =
                      ((canEditEverything || canEditTexts) && !isApproved) ||
                      (canEditAsEvaluator && isBeingEvaluated);
                    const canEditVeracity =
                      (canEditEverything && !isApproved) ||
                      (canEditAsEvaluator && isBeingEvaluated);
                    const canEditExplanations =
                      ((canEditEverything || canEditTexts) && !isApproved) ||
                      (canEditAsEvaluator && isBeingEvaluated);
                    const canEditEvaluator = canEditEverything && isBeingEvaluated;
                    const canEditPublished = canEditEverything && isApproved;
                    const canEditImportant = canEditEverything;

                    const isApprovedAndNotPublished = isApproved && !values.published;
                    const isBeingEvaluatedAndEvaluationFilled =
                      isBeingEvaluated &&
                      (values.assessment.veracity_id &&
                        values.assessment.short_explanation &&
                        values.assessment.explanation_html);

                    const canEditStatus =
                      (canEditEverything &&
                        (isApprovedAndNotPublished ||
                          isBeingEvaluatedAndEvaluationFilled ||
                          isApprovalNeeded)) ||
                      (canEditAsEvaluator && isBeingEvaluated);

                    let statusTooltipContent: string | null = null;
                    if (canEditEverything && isBeingEvaluated && !canEditStatus) {
                      statusTooltipContent =
                        'Aby šel výrok posunout ke kontrole, ' +
                        'musí být vyplněné hodnocení a odůvodnění, včetně zkráceného';
                    }
                    if (canEditEverything && isApproved && !canEditStatus) {
                      statusTooltipContent =
                        'Aby šel výrok vrátit ke zpracování, nesmí být zveřejněný';
                    }

                    const canViewEvaluation =
                      canEditAsEvaluator ||
                      isApproved ||
                      this.props.isAuthorized(['statements:view-unapproved-evaluation']);

                    const canEditSomething =
                      canEditStatementContent ||
                      canEditVeracity ||
                      canEditExplanations ||
                      canEditEvaluator ||
                      canEditPublished ||
                      canEditImportant ||
                      canEditStatus;

                    return (
                      <div style={{ marginTop: 15 }}>
                        <FormikAutoSave
                          debounceWait={500}
                          submitForm={submitForm}
                          values={values}
                          initialValues={initialValues}
                        />
                        <div className="float-right">
                          <Link
                            to={`/admin/sources/${statement.source.id}`}
                            className="btn btn-secondary"
                          >
                            Zpět na zdroj výroku
                          </Link>
                        </div>

                        <div style={{ display: 'flex' }}>
                          <h3>Detail výroku</h3>

                          {canEditSomething && (
                            <div className="text-muted" style={{ marginLeft: 20, marginTop: 9 }}>
                              {!status && !isSubmitting && 'Změny jsou ukládány automaticky'}
                              {status &&
                                status === 'saved' &&
                                !isSubmitting &&
                                'Změny úspěšně uloženy'}
                              {isSubmitting && 'Ukládám změny ...'}
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', marginTop: 20, marginBottom: 30 }}>
                          <div style={{ flex: '2 0' }}>
                            <h5>
                              {statement.speaker.first_name} {statement.speaker.last_name}
                            </h5>
                            {canEditStatementContent ? (
                              <textarea
                                className="form-control"
                                style={{ marginBottom: 5 }}
                                name="content"
                                rows={4}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.content || ''}
                              />
                            ) : (
                              <p>{newlinesToBr(values.content)}</p>
                            )}
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
                              style={{
                                borderTop: '2px solid #ccc',
                                marginTop: 30,
                                marginBottom: 30,
                              }}
                            />

                            {(canEditVeracity || canEditExplanations || canViewEvaluation) && (
                              <>
                                <div className="form-group row">
                                  <label htmlFor="veracity" className="col-sm-4 col-form-label">
                                    Hodnocení
                                  </label>
                                  <div className="col-sm-8">
                                    {canEditVeracity ? (
                                      <VeracitySelect
                                        disabled={
                                          values.assessment.evaluation_status ===
                                          ASSESSMENT_STATUS_APPROVED
                                        }
                                        onChange={(value) =>
                                          setFieldValue('assessment.veracity_id', value)
                                        }
                                        onBlur={() => setFieldTouched('assessment.veracity_id')}
                                        value={values.assessment.veracity_id}
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        readOnly
                                        className="form-control-plaintext"
                                        value={
                                          statement.assessment.veracity
                                            ? statement.assessment.veracity.name
                                            : ''
                                        }
                                      />
                                    )}
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label
                                    htmlFor="assessment-short-explanation"
                                    className="form-label"
                                  >
                                    Odůvodnění zkráceně
                                  </label>
                                  {canEditExplanations ? (
                                    <>
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
                                    </>
                                  ) : (
                                    <p>{values.assessment.short_explanation}</p>
                                  )}
                                </div>
                                <div className="form-group">
                                  <label htmlFor="assessment-explanation" className="form-label">
                                    Odůvodnění
                                  </label>
                                  {canEditExplanations ? (
                                    <RichTextEditor
                                      value={values.assessment.explanation_slatejson}
                                      onChange={(value, html) => {
                                        setFieldValue('assessment.explanation_slatejson', value);
                                        setFieldValue('assessment.explanation_html', html);
                                      }}
                                    />
                                  ) : (
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: values.assessment.explanation_html || '',
                                      }}
                                    />
                                  )}
                                </div>
                              </>
                            )}
                            {!canEditVeracity &&
                              !canEditExplanations &&
                              !canViewEvaluation && (
                                <div className="alert alert-info" role="alert">
                                  Hodnocení a odůvodnění tohoto výroku můžete vidět teprve až po
                                  schválení
                                </div>
                              )}
                          </div>

                          <div style={{ flex: '1 0', marginLeft: 30 }}>
                            <div className="form-group row">
                              <label htmlFor="status" className="col-sm-4 col-form-label">
                                Stav
                              </label>
                              <div className="col-sm-8">
                                <EvaluationStatusInput
                                  disabled={!canEditStatus}
                                  tooltipContent={statusTooltipContent}
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
                                  disabled={!canEditEvaluator}
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
                                  disabled={canEditPublished}
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
                                    disabled={!canEditPublished}
                                  />
                                </Tooltip>

                                {values.published && (
                                  <a href={`/vyrok/${statement.id}`}>Veřejný odkaz</a>
                                )}
                              </div>
                            </div>
                            <hr style={{ borderTop: '2px solid #ccc' }} />
                            {/* TODO: stitky */}
                            <div className="form-group row">
                              <label htmlFor="important" className="col-sm-4 col-form-label">
                                Důležitý
                              </label>
                              <div className="col-sm-8" style={{ paddingTop: 8 }}>
                                <Switch
                                  disabled={!canEditImportant}
                                  name="important"
                                  checked={values.important}
                                  onChange={handleChange}
                                  large
                                  inline
                                  style={{ margin: 0 }}
                                />
                              </div>
                            </div>
                            <hr style={{ borderTop: '2px solid #ccc' }} />
                            <StatementComments statementId={statement.id} />
                          </div>
                        </div>
                      </div>
                    );
                  }}
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
  tooltipContent: string | null;
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
    const { disabled, tooltipContent, value } = this.props;

    return (
      <>
        <input
          type="text"
          readOnly
          className="form-control-plaintext"
          id="status"
          value={ASSESSMENT_STATUS_LABELS[value]}
        />

        <Tooltip
          disabled={tooltipContent === null || !disabled}
          content={tooltipContent || ''}
          position={Position.TOP}
        >
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
            <button
              type="button"
              className={classNames('btn', 'btn-outline-secondary', { disabled })}
              onClick={this.onChange(ASSESSMENT_STATUS_BEING_EVALUATED)}
            >
              Vrátit ke zpracování
            </button>
          )}
        </Tooltip>
      </>
    );
  }
}

const mapStateToProps = (state: ReduxState) => ({
  currentUser: state.currentUser.user,
  isAuthorized: isAuthorized(state.currentUser.user),
});

export default connect(mapStateToProps)(StatementDetail);
