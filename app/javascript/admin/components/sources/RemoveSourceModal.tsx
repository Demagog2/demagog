import { DeleteModal } from '../modals/ConfirmDeleteModal';
import * as React from 'react';

export function RemoveSourceModal(props: {
  loading: boolean;
  sourceName: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <DeleteModal
      message={`Opravdu chcete smazat diskuzi ${props.sourceName} se všemi výroky, které k ní patří?`}
      loading={props.loading}
      onCancel={props.onClose}
      onConfirm={props.onConfirm}
    />
  );
}
