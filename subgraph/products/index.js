const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { readFileSync } = require('fs');

const typeDefs = gql(readFileSync('./schema.graphql', { encoding: 'utf-8' }));

const { generateProductData, generateMultipleProducts, generateDepartmentsData } = require('./product-data');

const resolvers = {
  Query: {
    bestSellers() {
      return generateMultipleProducts(5);
    },
    categories(){
      return generateDepartmentsData();
    },
    product(_, args) {
      return generateProductData(args.id);
    },
    products(_, args) {
      return generateMultipleProducts(args.first - args.from + 1);
    },
    topProducts(_, args) {
      return generateMultipleProducts(args.first);
    }
  },
  Product: {
    __resolveReference(reference) {
      return generateProductData(reference.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers })
});

const port = process.env.PORT || 4001;
const subgraphName = 'products';

server
  .listen({ port })
  .then(({ url }) => {
    console.log(`🚀 Subgraph ${subgraphName} running at ${url}`);
  })
  .catch((err) => {
    console.error(err);
  });