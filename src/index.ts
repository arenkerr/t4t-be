import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { loadSchema } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { makeExecutableSchema } from '@graphql-tools/schema';
import express, { json } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import resolvers from './resolvers/index.js';
import * as db from './database/models/sequelize.js';
import { authMiddleware } from './auth/middleware.auth.js';
import { config } from './util/cors.util.js';

const database = async () => {
  try {
    const { connect, migrate, associate } = db;
    connect();
    migrate.up();
    associate();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('database error', error);
  }
};

database();

const schema = makeExecutableSchema({
  typeDefs: await loadSchema('src/typeDefs/schema.gql', {
    loaders: [new GraphQLFileLoader()],
  }),
  resolvers,
});

const server = new ApolloServer({ schema });
const app = express();
const port = process.env.PORT;

await server.start();

app.use(authMiddleware);
app.use(
  '/graphql',
  cors(config),
  json(),
  cookieParser(),
  expressMiddleware(server, { context: async ({ req, res }) => ({ req, res }) })
);

app.listen({ port }, () =>
  // eslint-disable-next-line no-console
  console.log(`🚀 Server listening on port ${port}`)
);
