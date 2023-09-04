import { Button, Classes } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { useMutation } from 'react-apollo';
import React, { useState } from 'react';
import { css, cx } from 'emotion';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { useModal } from 'react-modal-hook';
import { DeleteModal } from '../modals/ConfirmDeleteModal';
import { useFlashMessage } from '../../hooks/use-flash-messages';

import { DeleteArticleTag as DeleteArticleTagMutation } from '../../queries/mutations';

import {
  DeleteArticleTag,
  DeleteArticleTagVariables,
  GetArticleTags_tags,
} from '../../operation-result-types';

import Loading from '../Loading';

interface IArticleTagsProps {
  loading: boolean;
  tags: GetArticleTags_tags[];
}

interface IArticleTags {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  published: boolean;
  stats?: number | null;
  video?: string;
}

export function ArticleTags(props: IArticleTagsProps) {
  if (props.loading) {
    return <Loading />;
  }

  const addFlashMessage = useFlashMessage();

  const [deleteArticleTag, setDeleteArticleTag] = useState<IArticleTags | null | undefined>(null);
  const [deleteArticleTagId, setDeleteArticleTagId] = useState<string | null>(null);

  const showConfirmDeleteModal = (tag) => {
    setDeleteArticleTagId(tag.id);
    setDeleteArticleTag(tag);
    openModal();
  };

  const [deleteTag, { loading: deleteArticleTagLoading }] = useMutation<
    DeleteArticleTag,
    DeleteArticleTagVariables
  >(DeleteArticleTagMutation, {
    variables: {
      id: deleteArticleTagId,
    },
    onCompleted() {
      addFlashMessage('Tag byl úspěšně smazán.', 'success');
      setDeleteArticleTag(null);
      setDeleteArticleTagId(null);
      closeModal();
    },

    onError() {
      addFlashMessage('Doško k chybě při mazání tagu', 'error');
    },
  });

  const [openModal, closeModal] = useModal(
    () => (
      <DeleteModal
        loading={deleteArticleTagLoading}
        message={`Opravdu chcete smazat tag ${deleteArticleTag?.title}?`}
        onCancel={closeModal}
        onConfirm={deleteTag}
      />
    ),
    [deleteArticleTag, deleteArticleTagLoading],
  );

  return (
    <div
      className={css`
        padding: 15px 0 40px 0;
      `}
    >
      <div style={{ float: 'right' }}>
        <Link
          className={classNames(
            Classes.BUTTON,
            Classes.INTENT_PRIMARY,
            Classes.iconClass(IconNames.PLUS),
            css`
              margin-left: 7px;
            `,
          )}
          to="/admin/article-tags/new"
          role="button"
        >
          Přidat tag
        </Link>
      </div>
      <h2 className={Classes.HEADING}>Tagy</h2>
      <table
        className={cx(Classes.HTML_TABLE, Classes.HTML_TABLE_STRIPED, Classes.HTML_TABLE_CONDENSED)}
        style={{ width: '100%' }}
      >
        <thead>
          <tr>
            <th scope="col">Název</th>
            <th scope="col">Url</th>
            <th scope="col">Stav</th>
            <th scope="col">Pozice</th>
            <th scope="col" />
          </tr>
        </thead>
        <tbody>
          {props.tags.map((tag) => (
            <tr key={tag.id}>
              <td>{tag.title}</td>
              <td>/tag/{tag.slug}</td>
              <td>
                {tag.published ? (
                  <span className={Classes.TEXT_MUTED}>Zveřejněný</span>
                ) : (
                  <span className={Classes.TEXT_MUTED}>Nezveřejněný</span>
                )}
              </td>
              <td>{tag.order}</td>
              <td>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Link
                    to={`/admin/article-tags/edit/${tag.id}`}
                    className={cx(Classes.BUTTON, Classes.iconClass(IconNames.EDIT))}
                  >
                    Upravit
                  </Link>
                  <Button
                    icon={IconNames.TRASH}
                    style={{ marginLeft: 7 }}
                    title="Smazat"
                    onClick={() => showConfirmDeleteModal(tag)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
