require('dotenv').config()

const { ApolloServer } = require('apollo-server');
const { ApolloServerPluginUsageReporting } = require('apollo-server-core')
const { ApolloGateway } = require('@apollo/gateway');

const gateway = new ApolloGateway({});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  plugins: [
    ApolloServerPluginUsageReporting({
      sendHeaders: {exceptNames: ["x-api-key"]},
    }),
  ],
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