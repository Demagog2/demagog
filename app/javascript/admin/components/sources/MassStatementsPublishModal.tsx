import * as React from 'react';
import { Button, Classes, Dialog, Intent } from '@blueprintjs/core';

interface IMassStatementsPublishModalProps {
  readyToPublishStatementsCount: number;
  isSaving: boolean;

  onConfirm: () => void;
  onClose: () => void;
}

export function MassStatementsPublishModal(props: IMassStatementsPublishModalProps) {
  return (
    <Dialog isOpen onClose={props.onClose} title="Opravdu zveřejnit?">
      <div className={Classes.DIALOG_BODY}>
        {props.readyToPublishStatementsCount > 0
          ? (
          <>
            Opravdu chceš zveřejnit všech {props.readyToPublishStatementsCount} schválených a
            nezveřejněných výroků v rámci této diskuze?
          </>
            )
          : (
          <>V rámci diskuze teď nemáš žádné schválené a nezveřejněné výroky.</>
            )}
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button text="Zpět" onClick={props.onClose} />
          {props.readyToPublishStatementsCount > 0 && (
            <Button
              intent={Intent.PRIMARY}
              onClick={props.onConfirm}
              text={
                props.isSaving
                  ? 'Zveřejňuju …'
                  : `Zveřejnit ${props.readyToPublishStatementsCount} výroků`
              }
              disabled={props.isSaving}
            />
          )}
        </div>
      </div>
    </Dialog>
  );
}
