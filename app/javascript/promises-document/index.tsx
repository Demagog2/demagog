import * as React from 'react';
import * as ReactDOM from 'react-dom';

import PromisesDocumentApp from './PromisesDocumentApp';

const appRootElement = document.getElementById('promises-document-app-root');
if (appRootElement !== null) {
  // Promises data passed in data-promises attribute from server
  const promises = JSON.parse(appRootElement.dataset.promises || '[]');

  ReactDOM.render(<PromisesDocumentApp promises={promises} />, appRootElement);
}
