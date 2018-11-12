import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  credentials: 'same-origin',
});

export default client;
