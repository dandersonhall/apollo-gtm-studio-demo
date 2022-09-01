const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { readFileSync } = require('fs');

const typeDefs = gql(readFileSync('./schema.graphql', { encoding: 'utf-8' }));

const { generateCustomerData } = require('./customer-data');

const resolvers = {
  Query: {
    me(_, args) {
      return generateCustomerData(args.id);
    }
  },
  Customer: {
    defaultShippingAddress({addressId}) {
      return {id:addressId};
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers })
});

const port = process.env.PORT || 4001;
const subgraphName = 'customers';

server
  .listen({ port })
  .then(({ url }) => {
    console.log(`🚀 Subgraph ${subgraphName} running at ${url}`);
  })
  .catch((err) => {
    console.error(err);
  });