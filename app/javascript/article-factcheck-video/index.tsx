import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
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
