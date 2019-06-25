import * as React from 'react';
import * as ReactDOM from 'react-dom';

import PromisesDocumentApp from './PromisesDocumentApp';

const appRootElement = document.getElementById('promises-document-app-root');
if (appRootElement !== null) {
  // Promises data passed in data attributes from server
  const statements = JSON.parse(appRootElement.dataset.statements || '[]');

  ReactDOM.render(<PromisesDocumentApp statements={statements} />, appRootElement);
}
