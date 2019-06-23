import * as React from 'react';

import {
  Button,
  Callout,
  Classes,
  Colors,
  FormGroup as BlueprintFormGroup,
  Intent,
  Position,
  Switch,
  Tooltip,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { ApolloError } from 'apollo-client';
import * as classNames from 'classnames';
import { css } from 'emotion';
import { Formik } from 'formik';
import { Mutation, Query } from 'react-apollo';
import { connect, DispatchProp } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import { isAuthorized } from '../authorization';
import {
  ASSESSMENT_STATUS_APPROVAL_NEEDED,
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_BEING_EVALUATED,
  ASSESSMENT_STATUS_LABELS,
  ASSESSMENT_STATUS_PROOFREADING_NEEDED,
} from '../constants';
import {
  AssessmentMethodologyRatingModel,
  GetStatementQuery,
  StatementType,
  UpdateStatementInput,
  UpdateStatementMutation,
  UpdateStatementMutationVariables,
} from '../operation-result-types';
import { UpdateStatement } from '../queries/mutations';
import { GetStatement } from '../queries/queries';
import { IState as ReduxState } from '../reducers';
import { displayDate, newlinesToBr } from '../utils';
import PromiseRatingSelect from './forms/controls/PromiseRatingSelect';
import SelectComponentField from './forms/controls/SelectComponentField';
import SelectField from './forms/controls/SelectField';
import TagsSelect from './forms/controls/TagsSelect';
import TextField from './forms/controls/TextField';
import UserSelect from './forms/controls/UserSelect';
import VeracitySelect from './forms/controls/VeracitySelect';
import FormGroup from './forms/FormGroup';
import FormikAutoSave from './forms/FormikAutoSave';
import Loading from './Loading';
import RichTextEditor from './RichTextEditor';
import StatementComments from './StatementComments';

// Little more than 10s so it does not sync with other polls
const GET_STATEMENT_POLL_INTERVAL = 10150;

const IS_EDITING_DEBOUNCE_TIMEOUT = 10000;
const UPDATE_STATEMENT_DEBOUNCE_TIMEOUT = 2000;

class UpdateStatementMutationComponent extends Mutation<
  UpdateStatementMutation,
  UpdateStatementMutationVariables
> {}

class GetStatementQueryComponent extends Query<GetStatementQuery> {}

const VERACITY_COLORS = {
  true: Colors.COBALT2,
  untrue: Colors.RED3,
  misleading: Colors.GOLD5,
  unverifiable: Colors.BLUE5,
};

const PROMISE_RATING_COLORS = {
  fulfilled: Colors.COBALT2,
  broken: Colors.RED3,
  in_progress: Colors.BLUE5,
  partially_fulfilled: Colors.BLUE5,
  stalled: Colors.GOLD5,
};

interface IProps extends RouteComponentProps<{ id: string }>, DispatchProp {
  currentUser: ReduxState['currentUser']['user'];
  isAuthorized: (permissions: string[]) => boolean;
}

interface IState {
  isEditing: boolean;
}

class StatementDetail extends React.Component<IProps, IState> {
  public updateStatementTimeoutId: number | null = null;
  public updateStatementPromise: Promise<any> | null = null;
  public isEditingTimeoutId: number | null = null;

  public state: IState = {
    isEditing: false,
  };

  public componentWillUnmount() {
    // TODO: what if there are pending changes?
    if (this.updateStatementTimeoutId !== null) {
      window.clearTimeout(this.updateStatementTimeoutId);
    }
    if (this.isEditingTimeoutId !== null) {
      window.clearTimeout(this.isEditingTimeoutId);
    }
  }

  public render() {
    const statementId = this.props.match.params.id;

    return (
      <GetStatementQueryComponent
        query={GetStatement}
        variables={{ id: parseInt(statementId, 10) }}
      >
        {({ data, loading, error, stopPolling, startPolling }) => {
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
            title: statement.title,
            published: statement.published,
            important: statement.important,
            count_in_statistics: statement.countInStatistics,
            tags: statement.tags.map((t) => t.id),
            speaker: statement.speaker.id,
            assessment: {
              evaluation_status: statement.assessment.evaluationStatus,
              veracity_id: statement.assessment.veracity ? statement.assessment.veracity.id : null,
              promise_rating_id: statement.assessment.promiseRating
                ? statement.assessment.promiseRating.id
                : null,
              short_explanation: statement.assessment.shortExplanation,
              explanation_html: statement.assessment.explanationHtml,
              explanation_slatejson: statement.assessment.explanationSlatejson,
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

          if (!this.state.isEditing) {
            startPolling(GET_STATEMENT_POLL_INTERVAL);
          }

          return (
            <UpdateStatementMutationComponent mutation={UpdateStatement}>
              {(updateStatement) => (
                <Formik
                  initialValues={initialValues}
                  enableReinitialize={enableReinitialize}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    stopPolling();
                    this.setState({ isEditing: true });

                    if (this.isEditingTimeoutId !== null) {
                      window.clearTimeout(this.isEditingTimeoutId);
                    }

                    this.isEditingTimeoutId = window.setTimeout(() => {
                      startPolling(GET_STATEMENT_POLL_INTERVAL);
                      this.setState({ isEditing: false });
                      this.isEditingTimeoutId = null;
                    }, IS_EDITING_DEBOUNCE_TIMEOUT);

                    if (this.updateStatementTimeoutId !== null) {
                      window.clearTimeout(this.updateStatementTimeoutId);
                      this.updateStatementTimeoutId = null;
                    }

                    this.updateStatementTimeoutId = window.setTimeout(() => {
                      this.updateStatementTimeoutId = null;

                      setSubmitting(true);

                      const statementInput: UpdateStatementInput = {
                        assessment: {
                          veracityId: values.assessment.veracity_id,
                          promiseRatingId: values.assessment.promise_rating_id,
                          evaluationStatus: values.assessment.evaluation_status,
                          evaluatorId: values.assessment.evaluator_id,
                          explanationHtml: values.assessment.explanation_html,
                          explanationSlatejson: values.assessment.explanation_slatejson,
                          shortExplanation: values.assessment.short_explanation,
                        },
                        countInStatistics: values.count_in_statistics,
                        content: values.content,
                        title: values.title,
                        important: values.important,
                        published: values.published,
                        tags: values.tags,
                        speaker: values.speaker,
                      };

                      this.updateStatementPromise = updateStatement({
                        variables: { id: parseInt(statement.id, 10), statementInput },
                      })
                        .then(() => {
                          setSubmitting(false);
                        })
                        .catch((mutationError: ApolloError) => {
                          setSubmitting(false);
                          resetForm();

                          this.props.dispatch(
                            addFlashMessage(
                              'Nepodařilo se uložit tvoji poslední změnu, zkus to prosím znovu',
                              'error',
                            ),
                          );
                          console.error(mutationError); // tslint:disable-line:no-console
                        })
                        .finally(() => {
                          this.updateStatementPromise = null;
                        });
                    }, UPDATE_STATEMENT_DEBOUNCE_TIMEOUT);
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
                  }) => {
                    const canEditEverything = this.props.isAuthorized(['statements:edit']);
                    const canEditAsEvaluator =
                      values.assessment.evaluator_id !== null &&
                      this.props.currentUser !== null &&
                      this.props.currentUser.id === values.assessment.evaluator_id &&
                      this.props.isAuthorized(['statements:edit-as-evaluator']);
                    const canEditAsProofreader = this.props.isAuthorized([
                      'statements:edit-as-proofreader',
                    ]);

                    const isApproved =
                      values.assessment.evaluation_status === ASSESSMENT_STATUS_APPROVED;
                    const isBeingEvaluated =
                      values.assessment.evaluation_status === ASSESSMENT_STATUS_BEING_EVALUATED;
                    const isApprovalNeeded =
                      values.assessment.evaluation_status === ASSESSMENT_STATUS_APPROVAL_NEEDED;
                    const isProofreadingNeeded =
                      values.assessment.evaluation_status === ASSESSMENT_STATUS_PROOFREADING_NEEDED;

                    const canEditStatement =
                      ((canEditEverything || canEditAsProofreader) && !isApproved) ||
                      (canEditAsEvaluator && isBeingEvaluated);
                    const canEditVeracity =
                      (canEditEverything && !isApproved) ||
                      (canEditAsEvaluator && isBeingEvaluated);
                    const canEditPromiseRating =
                      (canEditEverything && !isApproved) ||
                      (canEditAsEvaluator && isBeingEvaluated);
                    const canEditExplanations =
                      ((canEditEverything || canEditAsProofreader) && !isApproved) ||
                      (canEditAsEvaluator && isBeingEvaluated);
                    const canEditEvaluator = canEditEverything && isBeingEvaluated;
                    const canEditPublished = canEditEverything && isApproved;
                    const canEditImportant = canEditEverything;
                    const canEditCountInStatistics = canEditEverything;

                    const isApprovedAndNotPublished = isApproved && !values.published;
                    const isBeingEvaluatedAndEvaluationFilled =
                      isBeingEvaluated &&
                      values.assessment.short_explanation &&
                      values.assessment.explanation_html &&
                      ((statement.statementType === StatementType.factual &&
                        values.assessment.veracity_id) ||
                        (statement.statementType === StatementType.promise &&
                          values.assessment.promise_rating_id));

                    const canEditStatus =
                      (canEditEverything &&
                        (isApprovedAndNotPublished ||
                          isBeingEvaluatedAndEvaluationFilled ||
                          isApprovalNeeded ||
                          isProofreadingNeeded)) ||
                      (canEditAsProofreader && isProofreadingNeeded) ||
                      (canEditAsEvaluator &&
                        (isBeingEvaluatedAndEvaluationFilled || isApprovalNeeded));

                    let canEditStatusTo: string[] = [];
                    if (isBeingEvaluated) {
                      canEditStatusTo = canEditStatusTo.concat([ASSESSMENT_STATUS_APPROVAL_NEEDED]);
                    } else if (isApprovalNeeded) {
                      if (canEditAsEvaluator) {
                        // Evaluator can only return, not move status forward
                        canEditStatusTo = canEditStatusTo.concat([
                          ASSESSMENT_STATUS_BEING_EVALUATED,
                        ]);
                      } else {
                        canEditStatusTo = canEditStatusTo.concat([
                          ASSESSMENT_STATUS_BEING_EVALUATED,
                          ASSESSMENT_STATUS_PROOFREADING_NEEDED,
                        ]);
                      }
                    } else if (isProofreadingNeeded) {
                      canEditStatusTo = canEditStatusTo.concat([
                        ASSESSMENT_STATUS_BEING_EVALUATED,
                        ASSESSMENT_STATUS_APPROVED,
                      ]);
                    } else if (isApproved) {
                      canEditStatusTo = canEditStatusTo.concat([ASSESSMENT_STATUS_BEING_EVALUATED]);
                    }

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
                      canEditStatement ||
                      canEditVeracity ||
                      canEditPromiseRating ||
                      canEditExplanations ||
                      canEditEvaluator ||
                      canEditPublished ||
                      canEditImportant ||
                      canEditStatus;

                    return (
                      <div style={{ padding: '15px 0 40px 0' }}>
                        <FormikAutoSave
                          submitForm={submitForm}
                          values={values}
                          initialValues={initialValues}
                        />
                        <div style={{ float: 'right' }}>
                          <Link
                            to={`/admin/sources/${statement.source.id}`}
                            className={Classes.BUTTON}
                          >
                            Zpět na diskuzi
                          </Link>
                        </div>

                        <div style={{ display: 'flex' }}>
                          <h2 className={Classes.HEADING}>
                            Detail výroku{' '}
                            {statement.statementType === StatementType.promise
                              ? '(slib)'
                              : '(faktický)'}
                          </h2>

                          {canEditSomething && (
                            <div
                              className={Classes.TEXT_MUTED}
                              style={{ marginLeft: 20, marginTop: 12 }}
                            >
                              {isSubmitting ? 'Ukládám změny ...' : 'Změny úspěšně uloženy'}
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', marginTop: 20, marginBottom: 30 }}>
                          <div style={{ flex: '2 0' }}>
                            {canEditEverything ? (
                              <BlueprintFormGroup label="Řečník" labelFor="speaker">
                                <SelectField
                                  name="speaker"
                                  options={statement.source.speakers.map((s) => ({
                                    label: `${s.firstName} ${s.lastName}`,
                                    value: s.id,
                                  }))}
                                />
                              </BlueprintFormGroup>
                            ) : (
                              <h5 className={Classes.HEADING}>
                                {statement.speaker.firstName} {statement.speaker.lastName}
                              </h5>
                            )}
                            {canEditStatement ? (
                              <textarea
                                className={classNames(Classes.INPUT, Classes.FILL)}
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
                            <p className={Classes.TEXT_MUTED}>
                              Diskuze: {statement.source.name}, {statement.source.medium.name} ze
                              dne {displayDate(statement.source.releasedAt)}
                              {statement.source.mediaPersonalities.length > 0 && (
                                <>
                                  ,{' '}
                                  {statement.source.mediaPersonalities
                                    .map((p) => p.name)
                                    .join(' & ')}
                                </>
                              )}
                              {statement.source.sourceUrl && (
                                <>
                                  , <a href={statement.source.sourceUrl}>odkaz</a>
                                </>
                              )}
                              {' — '}
                              {statement.statementTranscriptPosition ? (
                                <Link
                                  to={`/admin/sources/${
                                    statement.source.id
                                  }/statements-from-transcript?highlightStatementId=${
                                    statement.id
                                  }`}
                                >
                                  Ukázat výrok v kontextu přepisu
                                </Link>
                              ) : (
                                <>Výrok nelze ukázat v kontextu přepisu, je vytvořený ručně</>
                              )}
                            </p>

                            {statement.statementType === StatementType.promise && (
                              <>
                                {canEditStatement ? (
                                  <div style={{ display: 'flex' }}>
                                    <div style={{ flex: '1 1 0' }}>
                                      <FormGroup label="Titulek" name="title">
                                        <TextField name="title" />
                                      </FormGroup>
                                    </div>
                                    <div style={{ flex: '1 1 0', marginLeft: '15px' }}>
                                      <FormGroup label="Štítky" name="tags">
                                        <SelectComponentField name="tags">
                                          {(renderProps) => (
                                            <TagsSelect
                                              forStatementType={StatementType.promise}
                                              {...renderProps}
                                            />
                                          )}
                                        </SelectComponentField>
                                      </FormGroup>
                                    </div>
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex' }}>
                                    <div style={{ flex: '1 1 0' }}>
                                      <p>Titulek: {values.title}</p>
                                    </div>
                                    <div style={{ flex: '1 1 0', marginLeft: '15px' }}>
                                      <p>Štítky: {statement.tags.map((t) => t.name).join(', ')}</p>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}

                            <hr
                              style={{
                                borderTop: '2px solid #ccc',
                                marginTop: 30,
                                marginBottom: 30,
                              }}
                            />

                            {(canEditVeracity ||
                              canEditPromiseRating ||
                              canEditExplanations ||
                              canViewEvaluation) && (
                              <>
                                {statement.assessment.assessmentMethodology.ratingModel ===
                                  AssessmentMethodologyRatingModel.veracity && (
                                  <>
                                    {canEditVeracity ? (
                                      <BlueprintFormGroup label="Hodnocení" labelFor="veracity">
                                        <VeracitySelect
                                          id="veracity"
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
                                      </BlueprintFormGroup>
                                    ) : (
                                      <p>
                                        {!statement.assessment.veracity && 'Zatím nehodnoceno'}

                                        {statement.assessment.veracity && (
                                          <span
                                            className={Classes.TEXT_LARGE}
                                            style={{
                                              color:
                                                VERACITY_COLORS[statement.assessment.veracity.key],
                                              fontWeight: 'bold',
                                            }}
                                          >
                                            {statement.assessment.veracity.name}
                                          </span>
                                        )}
                                      </p>
                                    )}
                                  </>
                                )}

                                {statement.assessment.assessmentMethodology.ratingModel ===
                                  AssessmentMethodologyRatingModel.promise_rating && (
                                  <>
                                    {canEditPromiseRating ? (
                                      <BlueprintFormGroup
                                        label="Hodnocení slibu"
                                        labelFor="promise-rating"
                                      >
                                        <PromiseRatingSelect
                                          id="promise-rating"
                                          disabled={
                                            values.assessment.evaluation_status ===
                                            ASSESSMENT_STATUS_APPROVED
                                          }
                                          onChange={(value) =>
                                            setFieldValue('assessment.promise_rating_id', value)
                                          }
                                          onBlur={() =>
                                            setFieldTouched('assessment.promise_rating_id')
                                          }
                                          value={values.assessment.promise_rating_id}
                                          allowedKeys={
                                            statement.assessment.assessmentMethodology.ratingKeys
                                          }
                                        />
                                      </BlueprintFormGroup>
                                    ) : (
                                      <p>
                                        {!statement.assessment.promiseRating && 'Zatím nehodnoceno'}

                                        {statement.assessment.promiseRating && (
                                          <span
                                            className={Classes.TEXT_LARGE}
                                            style={{
                                              color:
                                                PROMISE_RATING_COLORS[
                                                  statement.assessment.promiseRating.key
                                                ],
                                              fontWeight: 'bold',
                                            }}
                                          >
                                            {statement.assessment.promiseRating.name}
                                          </span>
                                        )}
                                      </p>
                                    )}
                                  </>
                                )}

                                {canEditExplanations ? (
                                  <BlueprintFormGroup
                                    label="Odůvodnění zkráceně"
                                    labelFor="assessment-short-explanation"
                                    helperText={
                                      'Maximálně na dlouhý tweet, tj. 280 znaků' +
                                      (values.assessment.short_explanation
                                        ? `. Aktuálně ${
                                            values.assessment.short_explanation.length
                                          } znaků.`
                                        : '')
                                    }
                                  >
                                    <textarea
                                      className={classNames(Classes.INPUT, Classes.FILL)}
                                      id="assessment-short-explanation"
                                      name="assessment.short_explanation"
                                      rows={3}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      value={values.assessment.short_explanation || ''}
                                      maxLength={280}
                                    />
                                  </BlueprintFormGroup>
                                ) : (
                                  <>
                                    <h6 className={Classes.HEADING}>Odůvodnění zkráceně</h6>
                                    <p>{values.assessment.short_explanation}</p>
                                  </>
                                )}

                                {canEditExplanations ? (
                                  <BlueprintFormGroup
                                    label="Odůvodnění"
                                    labelFor="assessment-explanation"
                                  >
                                    <RichTextEditor
                                      value={values.assessment.explanation_slatejson}
                                      html={values.assessment.explanation_html}
                                      onChange={(value, html) => {
                                        setFieldValue('assessment.explanation_slatejson', value);
                                        setFieldValue('assessment.explanation_html', html);
                                      }}
                                      statementExplanation
                                    />
                                  </BlueprintFormGroup>
                                ) : (
                                  <>
                                    <h6 className={Classes.HEADING}>Odůvodnění</h6>
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html: values.assessment.explanation_html || '',
                                      }}
                                      className={css`
                                        img {
                                          max-width: 100%;
                                        }
                                      `}
                                    />
                                  </>
                                )}
                              </>
                            )}
                            {!canEditVeracity &&
                              !canEditPromiseRating &&
                              !canEditExplanations &&
                              !canViewEvaluation && (
                                <Callout intent={Intent.PRIMARY} icon={IconNames.INFO_SIGN}>
                                  Hodnocení a odůvodnění tohoto výroku můžete vidět teprve až po
                                  schválení
                                </Callout>
                              )}
                          </div>

                          <div style={{ flex: '1 0', marginLeft: 30 }}>
                            <div className={classNames(Classes.FORM_GROUP, Classes.INLINE)}>
                              <label className={Classes.LABEL} style={{ flex: '1' }}>
                                Stav
                              </label>
                              <div style={{ flex: '2', paddingTop: 6 }}>
                                <EvaluationStatusInput
                                  disabled={
                                    !canEditStatus ||
                                    // If initialValues and values status or published are not the same, it means
                                    // that there was a param change and it is not propagated to server yet,
                                    // so we wait for the propagation, because we cannot skip the evaluation
                                    // states when doing graphql mutations.
                                    initialValues.assessment.evaluation_status !==
                                      values.assessment.evaluation_status ||
                                    initialValues.published !== values.published
                                  }
                                  enabledChanges={canEditStatusTo}
                                  tooltipContent={statusTooltipContent}
                                  value={values.assessment.evaluation_status}
                                  onChange={(value) =>
                                    setFieldValue('assessment.evaluation_status', value)
                                  }
                                />
                              </div>
                            </div>

                            <div className={classNames(Classes.FORM_GROUP, Classes.INLINE)}>
                              <label className={Classes.LABEL} style={{ flex: '1' }}>
                                {statement.source.experts.length === 1 ? 'Expert' : 'Experti'}
                              </label>
                              <div style={{ flex: '2', paddingTop: 6 }}>
                                {statement.source.experts
                                  .map((expert) => `${expert.firstName} ${expert.lastName}`)
                                  .join(', ')}
                                {statement.source.experts.length === 0 && (
                                  <span className={Classes.TEXT_MUTED}>Nepřiřazení</span>
                                )}
                              </div>
                            </div>

                            <div className={classNames(Classes.FORM_GROUP, Classes.INLINE)}>
                              <label className={Classes.LABEL} style={{ flex: '1', paddingTop: 2 }}>
                                Ověřovatel/ka
                              </label>
                              <div style={{ flex: '2' }}>
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

                            <div
                              className={classNames(Classes.FORM_GROUP, Classes.INLINE)}
                              style={{
                                marginBottom: 5,
                                // flex-start needed to align switch with tooltip and without label correctly
                                alignItems: 'flex-start',
                              }}
                            >
                              <label
                                htmlFor="published"
                                className={Classes.LABEL}
                                style={{ flex: '1' }}
                              >
                                Zvěřejněný
                              </label>
                              <div className={Classes.FORM_CONTENT} style={{ flex: '2' }}>
                                <div style={{ display: 'inline-block' }}>
                                  <Tooltip
                                    disabled={canEditPublished}
                                    content="Aby šel výrok zveřejnit, musí být ve schváleném stavu"
                                    position={Position.TOP}
                                  >
                                    <Switch
                                      id="published"
                                      name="published"
                                      checked={values.published}
                                      onChange={handleChange}
                                      disabled={!canEditPublished}
                                    />
                                  </Tooltip>
                                </div>

                                {statement.statementType === StatementType.factual &&
                                  values.published && (
                                    <a
                                      href={`/vyrok/${statement.id}`}
                                      style={{
                                        display: 'inline-block',
                                        marginTop: 6,
                                        verticalAlign: 'top',
                                      }}
                                    >
                                      Veřejný odkaz
                                    </a>
                                  )}
                              </div>
                            </div>

                            <hr style={{ borderTop: '2px solid #ccc' }} />

                            <div
                              className={classNames(Classes.FORM_GROUP, Classes.INLINE)}
                              style={{ marginTop: 10, marginBottom: 10 }}
                            >
                              <label
                                htmlFor="count_in_statistics"
                                className={classNames(Classes.LABEL, Classes.INLINE)}
                                style={{ flex: '1' }}
                              >
                                Ve&nbsp;statistikách
                              </label>
                              <div className={Classes.FORM_CONTENT} style={{ flex: '2' }}>
                                <Switch
                                  id="count_in_statistics"
                                  name="count_in_statistics"
                                  checked={values.count_in_statistics}
                                  onChange={handleChange}
                                  disabled={!canEditCountInStatistics}
                                />
                              </div>
                            </div>

                            <div
                              className={classNames(Classes.FORM_GROUP, Classes.INLINE)}
                              style={{
                                marginBottom: 10,
                                // flex-start needed to align switch without label correctly
                                alignItems: 'flex-start',
                              }}
                            >
                              <label
                                htmlFor="important"
                                className={Classes.LABEL}
                                style={{ flex: '1' }}
                              >
                                Důležitý
                              </label>
                              <div className={Classes.FORM_CONTENT} style={{ flex: '2' }}>
                                <Switch
                                  disabled={!canEditImportant}
                                  id="important"
                                  name="important"
                                  checked={values.important}
                                  onChange={handleChange}
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
  enabledChanges: string[];
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
    const { disabled, enabledChanges, tooltipContent, value } = this.props;

    return (
      <>
        <p style={{ marginBottom: 5 }}>{ASSESSMENT_STATUS_LABELS[value]}</p>

        <Tooltip
          disabled={tooltipContent === null || !disabled}
          content={tooltipContent || ''}
          position={Position.TOP}
        >
          <>
            {value === ASSESSMENT_STATUS_BEING_EVALUATED && (
              <Button
                disabled={disabled || !enabledChanges.includes(ASSESSMENT_STATUS_APPROVAL_NEEDED)}
                onClick={this.onChange(ASSESSMENT_STATUS_APPROVAL_NEEDED)}
                text="Posunout ke kontrole"
              />
            )}
            {value === ASSESSMENT_STATUS_APPROVAL_NEEDED && (
              <>
                <Button
                  disabled={disabled || !enabledChanges.includes(ASSESSMENT_STATUS_BEING_EVALUATED)}
                  onClick={this.onChange(ASSESSMENT_STATUS_BEING_EVALUATED)}
                  text="Vrátit ke zpracování"
                />
                <Button
                  disabled={
                    disabled || !enabledChanges.includes(ASSESSMENT_STATUS_PROOFREADING_NEEDED)
                  }
                  onClick={this.onChange(ASSESSMENT_STATUS_PROOFREADING_NEEDED)}
                  text="Posunout ke korektuře"
                />
              </>
            )}
            {value === ASSESSMENT_STATUS_PROOFREADING_NEEDED && (
              <>
                <Button
                  disabled={disabled || !enabledChanges.includes(ASSESSMENT_STATUS_BEING_EVALUATED)}
                  onClick={this.onChange(ASSESSMENT_STATUS_BEING_EVALUATED)}
                  text="Vrátit ke zpracování"
                />
                <Button
                  disabled={disabled || !enabledChanges.includes(ASSESSMENT_STATUS_APPROVED)}
                  onClick={this.onChange(ASSESSMENT_STATUS_APPROVED)}
                  text="Schválit"
                />
              </>
            )}
            {value === ASSESSMENT_STATUS_APPROVED && (
              <Button
                disabled={disabled || !enabledChanges.includes(ASSESSMENT_STATUS_BEING_EVALUATED)}
                onClick={this.onChange(ASSESSMENT_STATUS_BEING_EVALUATED)}
                text="Vrátit ke zpracování"
              />
            )}
          </>
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
