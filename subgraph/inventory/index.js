const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { readFileSync } = require('fs');

const typeDefs = gql(readFileSync('./schema.graphql', { encoding: 'utf-8' }));

const { generateWarehouseData, generateApproxLocationData, generateDeliveryEstimates } = require('./inventory-data');

const resolvers = {
  Warehouse: {
    __resolveReference(reference) {
      return generateWarehouseData(reference.id);
    },
    address({addressId}) {
      return {id:addressId};
    }
  },
  ApproxLocation: {
    __resolveReference(reference) {
      return generateApproxLocationData(reference.id);
    }
  },
  ProductInventory: {
    product({productId}) {
      return {id:productId};
    }
  },
  Order: {
    origin() {
      return generateWarehouseData();
    }
  },
  Product: {
    inventory() {
      return Math.round(Math.random() * 1000);
    },
    delivery() {
      return generateDeliveryEstimates();
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers })
});

const port = process.env.PORT || 4001;
const subgraphName = 'inventory';

server
  .listen({ port })
  .then(({ url }) => {
    console.log(`🚀 Subgraph ${subgraphName} running at ${url}`);
  })
  .catch((err) => {
    console.error(err);
  });