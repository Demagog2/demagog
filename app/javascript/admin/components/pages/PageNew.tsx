import React, { useCallback } from 'react';

import { Mutation } from 'react-apollo';
import { useDispatch } from 'react-redux';

import { addFlashMessage } from '../../actions/flashMessages';
import type {
  CreatePage as CreatePageMutation,
  CreatePageVariables as CreatePageMutationVariables,
} from '../../operation-result-types';
import { CreatePage } from '../../queries/mutations';
import { GetPages } from '../../queries/queries';
import { PageForm } from '../forms/PageForm';
import { useNavigate } from 'react-router';

export function PageNew() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSuccess = useCallback(
    (pageId: string) => {
      dispatch(addFlashMessage('stránka byl úspěšně uložena.', 'success'));

      navigate(`/admin/pages/edit/${pageId}`);
    },
    [dispatch, navigate],
  );

  const onError = useCallback(
    (error) => {
      dispatch(addFlashMessage('Došlo k chybě při ukládání stránky.', 'error'));
      console.error(error);
    },
    [dispatch],
  );

  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      <Mutation<CreatePageMutation, CreatePageMutationVariables>
        mutation={CreatePage}
        // TODO: is there a nicer way of updating apollo cache after creating?
        refetchQueries={[{ query: GetPages, variables: { title: '', offset: 0, limit: 50 } }]}
        onCompleted={(data) => { data.createPage && onSuccess(data.createPage.page.id); }}
        onError={onError}
      >
        {(createPage) => {
          return (
            <PageForm
              onSubmit={async(pageInput) => await createPage({ variables: { pageInput } })}
              title="Přidat novou stránku"
              backPath="/admin/pages"
            />
          );
        }}
      </Mutation>
    </div>
  );
}
