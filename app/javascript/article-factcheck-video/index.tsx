import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import ArticleFactcheckVideoApp from './ArticleFactcheckVideoApp';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: '/graphql',
});

const client = new ApolloClient({ link, cache });

const appRootElement = document.getElementById('article-factcheck-video-app-root');
if (appRootElement !== null) {
  const articleId = appRootElement.dataset.articleId;
  const articleIllustrationImageHtml = appRootElement.innerHTML;

  if (articleId) {
    ReactDOM.render(
      <ApolloProvider client={client}>
        <ArticleFactcheckVideoApp
          articleId={parseInt(articleId, 10)}
          articleIllustrationImageHtml={articleIllustrationImageHtml}
        />
      </ApolloProvider>,
      appRootElement,
    );
  }
}
