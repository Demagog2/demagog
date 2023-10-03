import React, { useCallback } from 'react';
import { useNavigate } from 'react-router';
import type { IUserFormData } from '../forms/UserForm';
import { UserForm } from '../forms/UserForm';
import { useMutation } from 'react-apollo';
import type { CreateUser, CreateUserVariables } from '../../operation-result-types';
import { CreateUser as CreateUserMutation } from '../../queries/mutations';
import { uploadUserAvatar } from '../../api';
import { useFlashMessage } from '../../hooks/use-flash-messages';
import { captureException } from '@sentry/browser';

export function UserNew() {
  const navigate = useNavigate();
  const addFlashMessage = useFlashMessage();

  const onCompleted = useCallback(
    (userId: number) => {
      addFlashMessage('Osoba byla úspěšně uložena.', 'success');
      navigate(`/admin/users/edit/${userId}`);
    },
    [addFlashMessage],
  );

  const onError = useCallback(
    (error: Error) => {
      addFlashMessage('Při ukládání došlo k chybě.', 'error');
      captureException(error);
    },
    [addFlashMessage],
  );

  const [mutate] = useMutation<CreateUser, CreateUserVariables>(CreateUserMutation);

  const onSubmit = useCallback(
    async(formData: IUserFormData) => {
      const { avatar, ...userInput } = formData;

      try {
        const { data } = await mutate({ variables: { userInput } });

        const userId = parseInt(data?.createUser?.user.id ?? '', 10);

        if (avatar instanceof File) {
          try {
            await uploadUserAvatar(userId, avatar);
          } catch (error) {
            if (error.status === 413) {
              addFlashMessage(
                'Obrázek je větší než teď povolujeme, zmenšete ho a nahrajte znovu.',
                'warning',
              );
            } else {
              throw error;
            }
          }
        }

        onCompleted(userId);
      } catch (error) {
        onError(error);
      }
    },
    [mutate, onCompleted, onError, addFlashMessage],
  );

  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      <UserForm onSubmit={onSubmit} title="Přidat nového člena týmu" />
    </div>
  );
}
