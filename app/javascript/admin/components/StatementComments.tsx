import * as React from 'react';

import { Button, Classes } from '@blueprintjs/core';
import * as classNames from 'classnames';
import { Formik } from 'formik';
import { Mutation, Query } from 'react-apollo';

import {
  CommentInputType,
  CreateCommentMutation,
  CreateCommentMutationVariables,
  GetStatementCommentsQuery,
  GetStatementCommentsQueryVariables,
} from '../operation-result-types';
import { CreateComment } from '../queries/mutations';
import { GetStatementComments } from '../queries/queries';
import { displayDateTime } from '../utils';
import Authorize from './Authorize';
import Loading from './Loading';

class GetStatementCommentsQueryComponent extends Query<
  GetStatementCommentsQuery,
  GetStatementCommentsQueryVariables
> {}

class CreateCommentMutationComponent extends Mutation<
  CreateCommentMutation,
  CreateCommentMutationVariables
> {}

interface IProps {
  statementId: string;
}

class StatementComments extends React.Component<IProps> {
  public render() {
    return (
      <GetStatementCommentsQueryComponent
        query={GetStatementComments}
        variables={{ id: parseInt(this.props.statementId, 10) }}
        pollInterval={5000}
      >
        {({ data, loading, error, refetch }) => {
          if (error) {
            console.error(error); // tslint:disable-line:no-console
          }

          if (loading) {
            return <Loading />;
          }

          if (!data) {
            return null;
          }

          return (
            <div>
              {data.statement.comments.map((comment) => (
                <div key={comment.id} style={{ marginBottom: 15 }}>
                  <strong>
                    {comment.user.first_name} {comment.user.last_name}
                  </strong>
                  <small className={Classes.TEXT_MUTED} style={{ marginLeft: 10 }}>
                    {displayDateTime(comment.created_at)}
                  </small>
                  <p style={{ marginTop: 3 }}>{comment.content}</p>
                </div>
              ))}

              <Authorize permissions={['statements:comments:add']}>
                <AddCommentForm
                  statementId={this.props.statementId}
                  onCommentAdded={() => {
                    refetch({ id: parseInt(this.props.statementId, 10) });
                  }}
                />
              </Authorize>
            </div>
          );
        }}
      </GetStatementCommentsQueryComponent>
    );
  }
}

interface IAddCommentFormProps {
  statementId: string;
  onCommentAdded: () => void;
}

const AddCommentForm = (props: IAddCommentFormProps) => {
  const initialValues = {
    content: '',
  };

  return (
    <CreateCommentMutationComponent mutation={CreateComment}>
      {(createComment) => (
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const commentInput: CommentInputType = {
              content: values.content.trim(),
              statement_id: props.statementId,
            };

            createComment({ variables: { commentInput } })
              .then(() => {
                resetForm();
                props.onCommentAdded();
              })
              .catch((error) => {
                setSubmitting(false);
                // TODO setErrors();

                console.error(error); // tslint:disable-line:no-console
              });
          }}
        >
          {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <textarea
                name="content"
                className={classNames(Classes.INPUT, Classes.FILL)}
                value={values.content}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Button
                type="submit"
                disabled={isSubmitting || values.content.trim() === ''}
                text={isSubmitting ? 'Přidávám ...' : 'Přidat komentář'}
                style={{ marginTop: 7 }}
              />
            </form>
          )}
        </Formik>
      )}
    </CreateCommentMutationComponent>
  );
};

export default StatementComments;
