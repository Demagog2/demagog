import * as React from 'react';

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
    const { message, title, onCancel, mutation, mutationProps } = this.props;

    return (
      <React.Fragment>
        <div className="modal-backdrop show" onClick={onCancel} />
        <div className="modal show" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={onCancel}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">{message}</div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={onCancel}
                >
                  Zpět
                </button>
                <Mutation mutation={mutation} {...mutationProps}>
                  {(mutate, { loading }) => (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => mutate()}
                      disabled={loading}
                    >
                      {loading ? 'Mažu ...' : 'Smazat'}
                    </button>
                  )}
                </Mutation>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default ConfirmDeleteModal;
