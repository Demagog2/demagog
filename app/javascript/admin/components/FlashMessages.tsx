import * as React from 'react';
import { connect, Dispatch } from 'react-redux';

import { removeFlashMessage } from '../actions/flashMessages';

// Modal backdrop has z-index 1050, so we want to be over it
const FLASH_MESSAGE_Z_INDEX = 2000;

export type FlashMessageType = 'success' | 'error' | 'info' | 'warning';

const TYPE_CLASSNAME = {
  success: 'alert-success',
  error: 'alert-danger',
  info: 'alert-primary',
  warning: 'alert-warning',
};

interface IFlashMessagesProps {
  dispatch: Dispatch;
  messages: Array<{
    id: string;
    message: string;
    type: FlashMessageType;
  }>;
}

class FlashMessages extends React.Component<IFlashMessagesProps> {
  public onCloseClick = (id: string) => () => {
    this.props.dispatch(removeFlashMessage(id));
  };

  public render() {
    return (
      <div className="container fixed-bottom" style={{ zIndex: FLASH_MESSAGE_Z_INDEX }}>
        {this.props.messages.map((message) => (
          <div
            key={message.id}
            className={`alert ${TYPE_CLASSNAME[message.type]}`}
            role="alert"
            onClick={this.onCloseClick(message.id)}
          >
            {message.message}
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={this.onCloseClick(message.id)}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ messages: state.flashMessages });

export default connect(mapStateToProps)(FlashMessages);
