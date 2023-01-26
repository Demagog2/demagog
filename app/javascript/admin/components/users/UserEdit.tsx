import React, { useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { RouteComponentProps } from 'react-router-dom';
import { UserForm, IUserFormData } from '../forms/UserForm';
import {
  UpdateUser,
  UpdateUserVariables,
  GetUser,
  GetUserVariables,
} from '../../operation-result-types';
import { UpdateUser as UpdateUserMutation } from '../../queries/mutations';
import { GetUser as GetUserQuery } from '../../queries/queries';
import { uploadUserAvatar, deleteUserAvatar } from '../../api';
import { useFlashMessage } from '../../hooks/use-flash-messages';
import { captureException } from '@sentry/browser';
import Loading from '../Loading';
import { useSelector, useDispatch } from 'react-redux';
import { IState } from '../../reducers';
import { fetchCurrentUser } from '../../actions/currentUser';

interface IUserEditProps extends RouteComponentProps<{ id: string }> {}

export function UserEdit(props: IUserEditProps) {
  const dispatch = useDispatch();
  const addFlashMessage = useFlashMessage();
  const currentUser = useSelector((state: IState) => state.currentUser.user);

  const userId = parseInt(props.match.params.id, 10);

  const [mutate] = useMutation<UpdateUser, UpdateUserVariables>(UpdateUserMutation);
  const { data, loading } = useQuery<GetUser, GetUserVariables>(GetUserQuery, {
    variables: {
      id: userId,
    },
  });

  const onCompleted = useCallback(() => {
    addFlashMessage('Uložení proběhlo v pořádku', 'success');

    if (parseInt(currentUser?.id ?? '', 10) === userId) {
      // When we are editing ourselves, lets update the currentUser info
      dispatch(fetchCurrentUser());
    }
  }, [addFlashMessage, dispatch, currentUser, userId]);

  const onError = useCallback(
    (error: Error) => {
      addFlashMessage('Při ukládání došlo k chybě.', 'error');
      captureException(error);
    },
    [addFlashMessage],
  );

  const onSubmit = useCallback(
    async (formData: IUserFormData) => {
      const { avatar, ...userInput } = formData;

      try {
        // We want to first update the avatar and then run mutation so the avatar
        // gets automatically refresh in Apollo's cache from the mutation result data
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
        } else if (avatar === null && data?.user.avatar !== null) {
          await deleteUserAvatar(userId);
        }

        await mutate({ variables: { userInput, id: userId } });

        onCompleted();
      } catch (error) {
        onError(error);
      }
    },
    [mutate, data, userId, onCompleted, onError, addFlashMessage],
  );

  return (
    <div style={{ padding: '15px 0 40px 0' }}>
      {loading ? (
        <Loading />
      ) : (
        <UserForm onSubmit={onSubmit} title="Upravit člena týmu" user={data?.user} />
      )}
    </div>
  );
}
