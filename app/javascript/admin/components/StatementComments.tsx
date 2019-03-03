import * as React from 'react';

import { Button, Classes } from '@blueprintjs/core';
import anchorme from 'anchorme';
import { differenceInHours, distanceInWords, format } from 'date-fns';
import * as dateFnsCsLocale from 'date-fns/locale/cs';
import { css, cx } from 'emotion';
import { Formik } from 'formik';
import { Mutation, Query } from 'react-apollo';
import { Mention, MentionsInput } from 'react-mentions';

import {
  CommentInputType,
  CreateCommentMutation,
  CreateCommentMutationVariables,
  GetStatementCommentsQuery,
  GetStatementCommentsQueryVariables,
  GetUsersQuery,
  GetUsersQueryVariables,
} from '../operation-result-types';
import { CreateComment } from '../queries/mutations';
import { GetStatementComments, GetUsers } from '../queries/queries';
import Authorize from './Authorize';
import Loading from './Loading';

class GetStatementCommentsQueryComponent extends Query<
  GetStatementCommentsQuery,
  GetStatementCommentsQueryVariables
> {}

class GetUsersQueryComponent extends Query<GetUsersQuery, GetUsersQueryVariables> {}

class CreateCommentMutationComponent extends Mutation<
  CreateCommentMutation,
  CreateCommentMutationVariables
> {}

interface IProps {
  statementId: string;
}

class StatementComments extends React.PureComponent<IProps> {
  public render() {
    return (
      <GetStatementCommentsQueryComponent
        query={GetStatementComments}
        variables={{ id: parseInt(this.props.statementId, 10) }}
        pollInterval={20350} // Little more than 20s so it does not sync with other polls
      >
        {({ data, loading, error, refetch }) => {
          if (error) {
            console.error(error); // tslint:disable-line:no-console
          }

          if (loading && (!data || !data.statement)) {
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
                    <FormatCreatedAt createdAt={comment.created_at} />
                  </small>
                  <p
                    style={{ marginTop: 3 }}
                    className={css`
                      margin-top: 3px;
                      word-break: break-word;

                      span.highlight {
                        background-color: rgb(206, 230, 249);
                      }
                    `}
                    dangerouslySetInnerHTML={{
                      __html: highlightMentions(nicerLinks(comment.content)),
                    }}
                  />
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

const highlightMentions = (commentContent: string) =>
  commentContent.replace(/@\[([^\]]+)\]\([^\)]+\)/g, '<span class="highlight">$1</span>');

const nicerLinks = (commentContent: string) =>
  anchorme(commentContent, {
    truncate: [30, 15],
    attributes: [{ name: 'target', value: '_blank' }],
    // Bugfix for percent being encoded twice, see https://github.com/alexcorvi/anchorme.js/issues/49
    exclude: (urlObj) => {
      urlObj.encoded = urlObj.encoded.replace(/%25/g, '%');
      return false;
    },
  });

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
          {({ values, handleSubmit, isSubmitting, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <div
                className={cx(
                  Classes.FORM_GROUP,
                  css`
                    margin-bottom: 0;
                  `,
                )}
              >
                <CommentInput
                  onChange={(value) => setFieldValue('content', value)}
                  value={values.content}
                />
                {values.content.trim() !== '' && (
                  <div className={Classes.FORM_HELPER_TEXT}>
                    Tip: Můžeš zmínit kohokoli z týmu — stačí napsat @ a vybrat koho. Také dostane
                    upozornění na tvůj komentář.
                  </div>
                )}
              </div>
              <Button
                type="submit"
                disabled={isSubmitting || values.content.trim() === ''}
                text={isSubmitting ? 'Přidávám …' : 'Přidat komentář'}
                className={css`
                  margin-top: 7px;
                `}
              />
            </form>
          )}
        </Formik>
      )}
    </CreateCommentMutationComponent>
  );
};

interface ICommentInputProps {
  onChange: (value: string) => void;
  value: string;
}

const CommentInput = (props: ICommentInputProps) => {
  return (
    <GetUsersQueryComponent query={GetUsers}>
      {({ data, loading, error }) => {
        if (error) {
          console.error(error); // tslint:disable-line:no-console
        }

        if (loading || !data) {
          return <Loading />;
        }

        const suggestions = data.users.map((u) => ({
          id: u.id,
          display: `${u.first_name} ${u.last_name}`,
        }));

        return (
          <MentionsInput
            value={props.value}
            onChange={(_, value) => props.onChange(value)}
            allowSpaceInQuery
            style={{
              '&multiLine': {
                highlighter: {
                  padding: 10,
                },

                input: {
                  border: 'none',
                  borderRadius: 3,
                  outline: 'none',
                  boxShadow:
                    '0 0 0 0 rgba(19, 124, 189, 0), 0 0 0 0 rgba(19, 124, 189, 0), ' +
                    'inset 0 0 0 1px rgba(16, 22, 26, 0.15), inset 0 1px 1px rgba(16, 22, 26, 0.2)',

                  fontSize: 14,
                  fontWeight: 400,
                  lineHeight: 1.28581,
                  padding: 10,
                  minHeight: 80,
                  wordBreak: 'break-word',
                },
              },
              // tslint:disable-next-line:object-literal-key-quotes
              suggestions: {
                list: {
                  backgroundColor: 'white',
                  border: '1px solid rgba(0,0,0,0.15)',
                  fontSize: 12,
                  maxHeight: 200,
                  overflow: 'scroll',
                },

                item: {
                  // tslint:disable-next-line:object-literal-key-quotes
                  padding: '5px 10px',
                  '&focused': {
                    backgroundColor: 'rgb(206, 230, 249)',
                  },
                },
              },
            }}
          >
            <Mention
              trigger="@"
              data={suggestions}
              style={{
                backgroundColor: 'rgb(206, 230, 249)',
              }}
              appendSpaceOnAdd
            />
          </MentionsInput>
        );
      }}
    </GetUsersQueryComponent>
  );
};

class FormatCreatedAt extends React.Component<{ createdAt: string }, { now: Date }> {
  public state = {
    now: new Date(),
  };
  private refreshInterval: any | null = null;

  public componentDidMount() {
    this.refreshInterval = setInterval(() => {
      this.setState({ now: new Date() });
    }, 60000);
  }

  public componentWillUnmount() {
    clearInterval(this.refreshInterval);
  }

  public render() {
    const { createdAt } = this.props;
    const { now } = this.state;

    const formatted = format(createdAt, 'dd D. M. YYYY H:mm', {
      locale: dateFnsCsLocale,
    });

    return differenceInHours(now, createdAt) <= 24 ? (
      <abbr title={formatted}>
        {distanceInWords(now, createdAt, {
          locale: dateFnsCsLocale,
          addSuffix: true,
        })}
      </abbr>
    ) : (
      formatted
    );
  }
}

export default StatementComments;
