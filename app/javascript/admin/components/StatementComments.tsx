import * as React from 'react';

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
                <p key={comment.id}>
                  <strong>
                    {comment.user.first_name} {comment.user.last_name}
                  </strong>
                  <span className="small text-muted" style={{ marginLeft: 10 }}>
                    {displayDateTime(comment.created_at)}
                  </span>
                  <br />
                  {comment.content}
                </p>
              ))}

              <AddCommentForm
                statementId={this.props.statementId}
                onCommentAdded={() => {
                  refetch({ id: parseInt(this.props.statementId, 10) });
                }}
              />
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
                className="form-control"
                value={values.content}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button
                type="submit"
                className="btn btn-outline-secondary"
                disabled={isSubmitting || values.content.trim() === ''}
                style={{ marginTop: 10 }}
              >
                {isSubmitting ? 'Přidávám ...' : 'Přidat komentář'}
              </button>
            </form>
          )}
        </Formik>
      )}
    </CreateCommentMutationComponent>
  );
};

export default StatementComments;
