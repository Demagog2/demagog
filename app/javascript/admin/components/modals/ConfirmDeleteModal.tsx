import * as React from 'react';

import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Mutation } from 'react-apollo';

interface IDeleteModalProps {
  title?: string;
  message?: string;
  loading: boolean;

  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteModal(props: IDeleteModalProps) {
  const { title = 'Opravdu smazat?', message = 'Opravdu chcete vybranou položku smazat?' } = props;

  return (
    <Dialog isOpen onClose={props.onCancel} title={title}>
      <div className={Classes.DIALOG_BODY}>{message}</div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button text="Zpět" onClick={props.onCancel} />
          <Button
            icon={IconNames.TRASH}
            intent={Intent.DANGER}
            onClick={props.onConfirm}
            text={props.loading ? 'Mažu ...' : 'Smazat'}
            disabled={props.loading}
          />
        </div>
      </div>
    </Dialog>
  );
}

interface IProps {
  message?: string;
  title?: string;
  onCancel?: () => any;
  mutation?: any;
  mutationProps?: any;
}

/**
 * @deprecated Use DeleteModal + hooks
 */
class ConfirmDeleteModal extends React.Component<IProps> {
  public render() {
    const { title, message, mutation, mutationProps, onCancel = () => undefined } = this.props;

    return (
      <Mutation mutation={mutation} {...mutationProps}>
        {(mutate, { loading }) => (
          <DeleteModal
            title={title}
            message={message}
            loading={loading}
            onConfirm={mutate}
            onCancel={onCancel}
          />
        )}
      </Mutation>
    );
  }
}

export default ConfirmDeleteModal;
