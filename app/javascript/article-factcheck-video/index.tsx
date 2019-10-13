import * as React from 'react';
import * as ReactDOM from 'react-dom';

import ArticleFactcheckVideoApp from './ArticleFactcheckVideoApp';

const appRootElement = document.getElementById('article-factcheck-video-app-root');
if (appRootElement !== null) {
  const articleIllustrationImageHtml = appRootElement.innerHTML;

  ReactDOM.render(
    <ArticleFactcheckVideoApp articleIllustrationImageHtml={articleIllustrationImageHtml} />,
    appRootElement,
  );
}
