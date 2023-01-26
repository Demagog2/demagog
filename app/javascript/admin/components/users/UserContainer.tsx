import React from 'react';
import { useMutation } from '@apollo/client';
import {
  UpdateUserActiveness as UpdateUserActivenessMutation,
  DeleteUser as DeleteUserMutation,
} from '../../queries/mutations';
import {
  UpdateUserActiveness,
  UpdateUserActivenessVariables,
  GetUsers_users,
  DeleteUser,
  DeleteUserVariables,
} from '../../operation-result-types';
import { User } from './User';
import { useModal } from 'react-modal-hook';
import { DeleteModal } from '../modals/ConfirmDeleteModal';
import { GetUsers } from '../../queries/queries';
import { useFlashMessage } from '../../hooks/use-flash-messages';

interface IUserContainerProps {
  user: GetUsers_users;
}

export function UserContainer(props: IUserContainerProps) {
  const addFlashMessage = useFlashMessage();
  const [updateUserActiveness, { loading }] = useMutation<
    UpdateUserActiveness,
    UpdateUserActivenessVariables
  >(UpdateUserActivenessMutation, {
    onCompleted() {
      addFlashMessage(
        `Uživatel úspěšně ${props.user.active ? 'aktivován' : 'deaktivován'}.`,
        'success',
      );
    },
    onError() {
      addFlashMessage(
        `Došlo k chybě při ${props.user.active ? 'deaktivaci' : 'aktivaci'} uživatele.`,
        'error',
      );
    },
  });

  const [deleteUser, { loading: deleteUserLoading }] = useMutation<DeleteUser, DeleteUserVariables>(
    DeleteUserMutation,
    {
      variables: {
        id: props.user.id,
      },
      refetchQueries: [
        {
          query: GetUsers,
          variables: {
            name: '',
            includeInactive: false,
          },
        },
      ],
      onCompleted() {
        addFlashMessage('Uživatel byl úspěšně smazán.', 'success');

        closeModal();
      },
      onError(error) {
        if (error.message.match(/cannot be deleted if it is already linked/)) {
          addFlashMessage(
            'Uživatele nelze smazat, protože už byl v systému aktivní. Deaktivujte jej.',
            'warning',
          );
          return;
        }

        addFlashMessage('Doško k chybě při mazání uživatele', 'error');
      },
    },
  );

  const [openModal, closeModal] = useModal(
    () => (
      <DeleteModal
        loading={deleteUserLoading}
        message={`Opravdu chcete smazat uživatele ${props.user.firstName} ${props.user.lastName}?`}
        onCancel={closeModal}
        onConfirm={deleteUser}
      />
    ),
    [props.user, deleteUserLoading],
  );

  return (
    <User
      user={props.user}
      loading={loading}
      onUpdateUserActiveness={(userActive) =>
        updateUserActiveness({
          variables: {
            id: parseInt(props.user.id, 10),
            userActive,
          },
        })
      }
      onDeleteUser={openModal}
    />
  );
}
