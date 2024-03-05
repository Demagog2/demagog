import { Button } from '@blueprintjs/core';
import gql from 'graphql-tag';
import React, { useCallback, useMemo } from 'react';
import { useMutation } from 'react-apollo';
import { IconNames } from '@blueprintjs/icons';
import { useFlashMessage } from '../../hooks/use-flash-messages';
import { PublishEfcsnArticleFragment } from '../../queries/queries';
import type { PublishEfcsnArticle as PublishEfcsnArticleType } from '../../operation-result-types';
import FormGroup from '../forms/FormGroup';

interface PublishEfcsnArticleProps {
  article: PublishEfcsnArticleType;
}

export function PublishEfcsnArticle(props: PublishEfcsnArticleProps) {
  const addFlashMessage = useFlashMessage();

  const [mutation, { loading }] = useMutation(gql`
    mutation publishEfcsnArticle($input: PublishEfcsnArticleMutationInput!) {
      publishEfcsnArticle(input: $input) {
        __typename
        ... on PublishEfcsnArticleSuccess {
          article {
            ...PublishEfcsnArticle
          }
        }
        ... on PublishEfcsnArticleError {
          message
        }
      }
    }
    ${PublishEfcsnArticleFragment}
  `, {
    onCompleted: (response) => {
      if (response.publishEfcsnArticle.__typename === 'PublishEfcsnArticleError') {
        addFlashMessage(response.publishEfcsnArticle.message, 'error');
      } else {
        addFlashMessage('Článek publikován do EFCSN', 'success');
      }
    },
  });

  const handleClick = useCallback(() => {
    void mutation({ variables: { input: { articleId: props.article.id } } });
  }, [props.article.id]);

  const buttonText = useMemo(() => {
    if (loading) {
      return 'Publikuje se';
    }

    if ((props.article.efcsnExternalId?.length ?? 0) > 0) {
      return 'Aktualizovat v EFCSN';
    }

    return 'Publikovat do EFCSN';
  }, [loading, props.article.efcsnExternalId]);

  return (
    <FormGroup name="efcsn_publish" label="EFCSN">
      <Button icon={IconNames.ARROW_UP} onClick={handleClick} loading={loading} text={buttonText} />
    </FormGroup>
  );
}
