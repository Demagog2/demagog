import * as React from 'react';

import { Button, Classes } from '@blueprintjs/core';
import anchorme from 'anchorme';
import { format, isToday, isYesterday } from 'date-fns';
import * as dateFnsCsLocale from 'date-fns/locale/cs';
import { css, cx } from 'emotion';
import { Formik } from 'formik';
import { Mutation, Query, useQuery } from 'react-apollo';
import { Mention, MentionsInput } from 'react-mentions';

import type {
  CreateComment as CreateCommentMutation,
  CreateCommentVariables as CreateCommentMutationVariables,
  GetUsers as GetUsersQuery,
  GetUsersVariables as GetUsersQueryVariables,
} from '../operation-result-types';
import {
  CommentInput,
} from '../operation-result-types';
import { CreateComment } from '../queries/mutations';
import { GetStatementComments, GetUsers } from '../queries/queries';
import Authorize from './Authorize';
import Loading from './Loading';

interface IProps {
  statementId: string;
}

export default function StatementComments(props: IProps) {
  const { data, error, loading, refetch } = useQuery(GetStatementComments, {
    variables: { id: parseInt(props.statementId, 10) },
    pollInterval: 20350, /// Little more than 20s so it does not sync with other polls
  });

  const [showStatements, setShowStatements] = React.useState(false);
  const onClick = () => {
    setShowStatements((s) => !s);
  };

  let allStatements;
  if (showStatements) {
    allStatements = (
      <div>
        {data.statement.comments.slice(0, data.statement.comments.length - 3).map((comment) => (
          <div key={comment.id} style={{ marginBottom: 15 }}>
            <strong>
              {comment.user.firstName} {comment.user.lastName}
            </strong>
            <small className={Classes.TEXT_MUTED} style={{ marginLeft: 10 }}>
              {formatCreatedAt(comment.createdAt)}
            </small>
            <div
              style={{ marginTop: 3 }}
              className={css`
                p {
                  margin: 3px 0 5px 0;
                  word-break: break-word;

                  span.highlight {
                    background-color: rgb(206, 230, 249);
                  }
                }
              `}
              dangerouslySetInnerHTML={{
                __html: newlinesToParagraphsAndBreaks(
                  highlightMentions(nicerLinks(comment.content)),
                ),
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    console.error(error);
  }

  if (loading && (!data?.statement)) {
    return <Loading />;
  }

  if (!data?.statement) {
    return null;
  }

  let textButtonHide;
  if (showStatements) {
    textButtonHide = 'Zobrazit jen poslední 3 komentáře';
  } else {
    textButtonHide = `Zobrazit ${data.statement.comments.length - 3} předchozích komentářů`;
  }

  return (
    <div>
      {data.statement.comments.length > 3 && (
        <a
          role="button"
          onClick={onClick}
          className={css`
            display: block;
            margin-top: 10px;
            margin-bottom: 10px;
          `}
        >
          {textButtonHide}
        </a>
      )}

      {allStatements}

      {data.statement.comments.slice(-3).map((comment) => (
        <div key={comment.id} style={{ marginBottom: 15 }}>
          <strong>
            {comment.user.firstName} {comment.user.lastName}
          </strong>
          <small className={Classes.TEXT_MUTED} style={{ marginLeft: 10 }}>
            {formatCreatedAt(comment.createdAt)}
          </small>
          <div
            style={{ marginTop: 3 }}
            className={css`
              p {
                margin: 3px 0 5px 0;
                word-break: break-word;

                span.highlight {
                  background-color: rgb(206, 230, 249);
                }
              }
            `}
            dangerouslySetInnerHTML={{
              __html: newlinesToParagraphsAndBreaks(highlightMentions(nicerLinks(comment.content))),
            }}
          />
        </div>
      ))}

      <Authorize permissions={['statements:comments:add']}>
        <AddCommentForm
          statementId={props.statementId}
          onCommentAdded={() => {
            refetch({ id: parseInt(props.statementId, 10) });
          }}
        />
      </Authorize>
    </div>
  );
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

const newlinesToParagraphsAndBreaks = (commentContent: string): string => {
  let paragraphs = commentContent.split(/(?:\r\n|\r|\n){2,}/);

  paragraphs = paragraphs.map((paragraph) => {
    const lines = paragraph.split(/(?:\r\n|\r|\n)/);

    return lines.join('<br>');
  });

  return paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('');
};

interface IAddCommentFormProps {
  statementId: string;
  onCommentAdded: () => void;
}

const AddCommentForm = (props: IAddCommentFormProps) => {
  const initialValues = {
    content: '',
  };

  return (
    <Mutation<CreateCommentMutation, CreateCommentMutationVariables> mutation={CreateComment}>
      {(createComment) => (
        <Formik
          initialValues={initialValues}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const commentInput: CommentInput = {
              content: values.content.trim(),
              statementId: props.statementId,
            };

            createComment({ variables: { commentInput } })
              .then(() => {
                resetForm();
                props.onCommentAdded();
              })
              .catch((error) => {
                setSubmitting(false);
                // TODO setErrors();

                console.error(error);
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
                  onChange={(value) => { setFieldValue('content', value); }}
                  value={values.content}
                />
                {values.content.trim() !== '' && (
                  <div className={Classes.FORM_HELPER_TEXT}>
                    Tip: Můžeš zmínit kohokoli z týmu — stačí napsat @ a vybrat koho. Také dostane
                    upozornění na tvůj komentář. @Editoři upozorní všechny editory u tohoto výroku.
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
    </Mutation>
  );
};

interface ICommentInputProps {
  onChange: (value: string) => void;
  value: string;
}

const CommentInput = (props: ICommentInputProps) => {
  return (
    <Query<GetUsersQuery, GetUsersQueryVariables> query={GetUsers}>
      {({ data, loading, error }) => {
        if (error) {
          console.error(error);
        }

        if (loading || !data) {
          return <Loading />;
        }

        const suggestions = data.users.map((u) => ({
          id: u.id,
          display: `${u.firstName} ${u.lastName}`,
        }));
        suggestions.unshift({
          id: 'experts',
          display: 'Editoři',
        });
        suggestions.unshift({
          id: 'proofreaders',
          display: 'Korektoři',
        });
        suggestions.unshift({
          id: 'social_media_managers',
          display: 'Síťaři',
        });

        return (
          <MentionsInput
            value={props.value}
            onChange={(_, value) => { props.onChange(value); }}
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
              suggestions: {
                list: {
                  backgroundColor: 'white',
                  border: '1px solid rgba(0,0,0,0.15)',
                  fontSize: 12,
                  maxHeight: 200,
                  overflow: 'scroll',
                },

                item: {
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
    </Query>
  );
};

const formatCreatedAt = (createdAt: string) => {
  let datePart = format(createdAt, 'dd D. M. YYYY', {
    locale: dateFnsCsLocale,
  });
  if (isToday(createdAt)) {
    datePart = 'dnes';
  } else if (isYesterday(createdAt)) {
    datePart = 'včera';
  }

  return datePart + format(createdAt, ' H:mm', { locale: dateFnsCsLocale });
};
