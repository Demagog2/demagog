import * as React from 'react';
import { connect } from 'react-redux';

// Modal backdrop has z-index 1050, so we want to be over it
const FLASH_MESSAGE_Z_INDEX = 2000;

interface IFlashMessagesProps {
  messages: string[];
}

function FlashMessage(props: { message: string }) {
  const { message } = props;

  return (
    <div className="container fixed-bottom" style={{ zIndex: FLASH_MESSAGE_Z_INDEX }}>
      <div key={message} className="alert alert-primary" role="alert">
        {message}
      </div>
    </div>
  );
}

function FlashMessages(props: IFlashMessagesProps) {
  return (
    <React.Fragment>
      {props.messages.map((message) => <FlashMessage key={message} message={message} />)}
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({ messages: state.flashMessages });

export default connect(mapStateToProps)(FlashMessages);
