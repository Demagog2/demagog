import * as React from 'react';

import * as classNames from 'classnames';
import { Formik } from 'formik';
import { DateTime } from 'luxon';
import { Mutation, Query } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link, withRouter } from 'react-router-dom';

import { addFlashMessage } from '../actions/flashMessages';
import {
  CreateStatementInputType,
  CreateStatementMutation,
  CreateStatementMutationVariables,
  GetSourceQuery,
  GetSourceQueryVariables,
} from '../operation-result-types';
import { CreateStatement } from '../queries/mutations';
import { GetSource, GetSourceStatements } from '../queries/queries';
import UserSelect from './forms/controls/UserSelect';
import Loading from './Loading';

class GetSourceQueryComponent extends Query<GetSourceQuery, GetSourceQueryVariables> {}

class CreateStatementMutationComponent extends Mutation<
  CreateStatementMutation,
  CreateStatementMutationVariables
> {}

interface IProps extends RouteComponentProps<{ sourceId: string }> {
  dispatch: Dispatch;
}

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

          const initialValues = {
            content: '',
            speaker_id: source.speakers[0].id,
            evaluator_id: null,
            note: '',
          };

          return (
            <CreateStatementMutationComponent
              mutation={CreateStatement}
              refetchQueries={[
                { query: GetSourceStatements, variables: { sourceId: parseInt(source.id, 10) } },
              ]}
            >
              {(createStatement) => (
                <Formik
                  initialValues={initialValues}
                  validate={(values) => {
                    const errors: { [key: string]: any } = {};
                    if (values.content.trim() === '') {
                      errors.content = 'Je třeba vyplnit znění výroku';
                    }
                    return errors;
                  }}
                  onSubmit={(values, { setSubmitting }) => {
                    const note = values.note.trim();

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
                      first_comment_content: note !== '' ? note : null,
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
                  {({
                    values,
                    touched,
                    errors,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                    setFieldTouched,
                    isSubmitting,
                  }) => (
                    <div role="main" style={{ marginTop: 15 }}>
                      <form onSubmit={handleSubmit}>
                        <div className="float-right">
                          <Link to={`/admin/sources/${source.id}`} className="btn btn-secondary">
                            Zpět na zdroj výroku
                          </Link>
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ marginLeft: 7 }}
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Ukládám ...' : 'Uložit'}
                          </button>
                        </div>

                        <h3>Přidat nový výrok</h3>

                        <div className="form-row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="form-control-label" htmlFor="content">
                                Znění
                              </label>
                              <textarea
                                id="content"
                                name="content"
                                className={classNames('form-control', {
                                  'is-invalid': !!(touched.content && errors.content),
                                })}
                                placeholder="Vložte či vepište znění …"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.content}
                                rows={5}
                              />
                              {touched.content &&
                                errors.content && (
                                  <div className="invalid-feedback">{errors.content}</div>
                                )}
                            </div>
                            <div className="form-group">
                              <label className="form-control-label" htmlFor="speaker_id">
                                Řečník
                              </label>
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
                          </div>

                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Ověřovatel</label>
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
                    </div>
                  )}
                </Formik>
              )}
            </CreateStatementMutationComponent>
          );
        }}
      </GetSourceQueryComponent>
    );
  }
}

export default connect()(withRouter(StatementNew));
