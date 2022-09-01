const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { readFileSync } = require('fs');

const typeDefs = gql(readFileSync('./schema.graphql', { encoding: 'utf-8' }));

const { generateCheckoutData } = require('./checkout-data');

const resolvers = {
  Checkout: {
    __resolveReference(reference) {
      return generateCheckoutData(reference.id);
    },
    customer({customerId}) {
      return {id:customerId};
    },
    order({orderId}) {
      return {id:orderId};
    }
  },
  Customer: {
    activeCart() {
      return generateCheckoutData(undefined, "IN_PROGRESS");
    },
    savedLists() {
      return generateCheckoutData();
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers })
});

const port = process.env.PORT || 4001;
const subgraphName = 'checkouts';

server
  .listen({ port })
  .then(({ url }) => {
    console.log(`🚀 Subgraph ${subgraphName} running at ${url}`);
  })
  .catch((err) => {
    console.error(err);
  });