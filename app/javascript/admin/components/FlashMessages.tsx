import * as React from 'react';
import { connect } from 'react-redux';

interface IFlashMessagesProps {
  messages: string[];
}

function FlashMessage(props: { message: string }) {
  const { message } = props;

  return (
    <div className="container fixed-bottom">
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
