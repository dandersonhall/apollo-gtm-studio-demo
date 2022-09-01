require('dotenv').config()

const { ApolloServer } = require('apollo-server');
const { ApolloServerPluginUsageReporting } = require('apollo-server-core')
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway');
const {GoogleAuth} = require('google-auth-library');

const auth = new GoogleAuth();

async function getGoogleIdToken(targetAudience) {
  const client = await auth.getIdTokenClient(targetAudience);
  const headers = await client.getRequestHeaders();
  return headers;
};

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  async willSendRequest({ request }) {
    const subgraph_url = request.http.url;
    const headers = await getGoogleIdToken(subgraph_url);
    request.http.headers.set('Authorization', headers['Authorization']);
  }
}

const gateway = new ApolloGateway({
  buildService({ url }) {
    return new AuthenticatedDataSource({ url });
  },
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  plugins: [
    ApolloServerPluginUsageReporting({
      sendHeaders: {exceptNames: ["x-api-key", "x-apigateway-api-consumer-number", "x-apigateway-api-consumer-type", "x-forwarded-for", "x-forwarded-proto"]},
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