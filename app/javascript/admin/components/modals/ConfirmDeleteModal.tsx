import * as React from 'react';

import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { Mutation } from 'react-apollo';

interface IProps {
  message?: string;
  title?: string;
  onCancel?: () => any;
  mutation?: any;
  mutationProps?: { [key: string]: any };
}

class ConfirmDeleteModal extends React.Component<IProps> {
  public static defaultProps: IProps = {
    message: 'Opravdu chcete vybranou položku smazat?',
    title: 'Opravdu smazat?',
    onCancel: () => undefined,
  };

  public render() {
    const { message, mutation, mutationProps, onCancel, title } = this.props;

    return (
      <Dialog isOpen onClose={onCancel} title={title}>
        <div className={Classes.DIALOG_BODY}>{message}</div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button text="Zpět" />
            <Mutation mutation={mutation} {...mutationProps}>
              {(mutate, { loading }) => (
                <Button
                  icon={IconNames.TRASH}
                  intent={Intent.DANGER}
                  onClick={() => mutate()}
                  text={loading ? 'Mažu ...' : 'Smazat'}
                  disabled={loading}
                />
              )}
            </Mutation>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default ConfirmDeleteModal;
