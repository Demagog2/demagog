import * as React from 'react';

import { Classes } from '@blueprintjs/core';
import * as classNames from 'classnames';
import { Form, Formik } from 'formik';
import { DateTime } from 'luxon';
import { Mutation, Query } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import * as yup from 'yup';

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
import SelectComponentField from './forms/controls/SelectComponentField';
import SelectField from './forms/controls/SelectField';
import TextareaField from './forms/controls/TextareaField';
import UserSelect from './forms/controls/UserSelect';
import FormGroup from './forms/FormGroup';
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
                  {({ isSubmitting }) => (
                    <div style={{ padding: '15px 0 40px 0' }}>
                      <Form>
                        <div style={{ float: 'right' }}>
                          <Link to={`/admin/sources/${source.id}`} className={Classes.BUTTON}>
                            Zpět na zdroj výroku
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

                        <h2>Přidat nový výrok</h2>

                        <div style={{ display: 'flex', marginTop: 30 }}>
                          <div style={{ flex: '0 0 200px', marginRight: 15 }}>
                            <h4>Výrok</h4>
                          </div>
                          <div style={{ flex: '1 1' }}>
                            <FormGroup label="Znění" name="content">
                              <TextareaField
                                name="content"
                                placeholder="Vložte či vepište znění…"
                                rows={7}
                              />
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
                          </div>
                        </div>

                        <div style={{ display: 'flex', marginTop: 30 }}>
                          <div style={{ flex: '0 0 200px', marginRight: 15 }}>
                            <h4>Ověřování</h4>
                          </div>
                          <div style={{ flex: '1 1' }}>
                            <FormGroup label="Ověřovatel" name="evaluator_id" optional>
                              <SelectComponentField name="evaluator_id">
                                {(renderProps) => <UserSelect role="expert" {...renderProps} />}
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
            </CreateStatementMutationComponent>
          );
        }}
      </GetSourceQueryComponent>
    );
  }
}

export default connect()(withRouter(StatementNew));
