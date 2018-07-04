import * as React from 'react';

import { Classes, Intent, Overlay, Toast } from '@blueprintjs/core';
import { connect, Dispatch } from 'react-redux';

import { removeFlashMessage } from '../actions/flashMessages';

export type FlashMessageType = 'success' | 'error' | 'info' | 'warning';

const TYPE_TO_INTENT = {
  success: Intent.SUCCESS,
  error: Intent.DANGER,
  info: Intent.NONE,
  warning: Intent.WARNING,
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
      <Overlay
        autoFocus={false}
        canOutsideClickClose={false}
        enforceFocus={false}
        hasBackdrop={false}
        isOpen={this.props.messages.length > 0}
        className={Classes.TOAST_CONTAINER}
      >
        {this.props.messages.map((message) => (
          <Toast
            key={message.id}
            message={message.message}
            intent={TYPE_TO_INTENT[message.type]}
            timeout={0}
            onDismiss={this.onCloseClick(message.id)}
          />
        ))}
      </Overlay>
    );
  }
}

const mapStateToProps = (state) => ({ messages: state.flashMessages });

export default connect(mapStateToProps)(FlashMessages);
