const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { readFileSync } = require('fs');

const typeDefs = gql(readFileSync('./schema.graphql', { encoding: 'utf-8' }));

const { generateOrderData, generateMultipleOrders } = require('./order-data');

const resolvers = {
  Order: {
    __resolveReference(reference) {
      return generateOrderData(reference.id);
    },
    shippingAddress({shippingAddressId}) {
      return {id:shippingAddressId};
    },
    billingAddress({billingAddressId}) {
      return {id:billingAddressId};
    }
  },
  LineItem: {
    product({productId}) {
      return {id:productId};
    },
    stockedFrom({stockLocationId}) {
      return {id:stockLocationId};
    }    
  },
  ApproxLocation: {
    warehouse({approxLocationId}) {
      return {id:approxLocationId};
    }
  },
  Customer: {
    orderHistory() {
      return generateMultipleOrders(Math.round(1 + Math.random()*4));
    }
  }
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers })
});

const port = process.env.PORT || 4001;
const subgraphName = 'orders';

server
  .listen({ port })
  .then(({ url }) => {
    console.log(`🚀 Subgraph ${subgraphName} running at ${url}`);
  })
  .catch((err) => {
    console.error(err);
  });