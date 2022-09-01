require('dotenv').config()

const { ApolloServer } = require('apollo-server');
const { ApolloGateway, IntrospectAndCompose } = require('@apollo/gateway');

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'checkouts', url: 'http://checkouts:3200' },
      { name: 'customers', url: 'http://customers:3200' },
      { name: 'inventory', url: 'http://inventory:3200' },
      { name: 'locations', url: 'http://locations:3200' },
      { name: 'orders', url: 'http://orders:3200' },
      { name: 'products', url: 'http://products:3200' },
      { name: 'reviews', url: 'http://reviews:3200' },
    ],
  }),
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
});

const port = process.env.PORT || 4000;

server
  .listen({ port })
  .then(({ url }) => {
    console.log(`🚀 Gateway ready at ${url}`);
  })
  .catch(err => {
    console.error(err)
  });