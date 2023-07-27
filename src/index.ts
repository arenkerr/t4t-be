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
import { authMiddleware } from './middleware/auth.middleware.js';
import { config } from './util/cors.util.js';
import { authDirectiveTransformer } from './directives/auth.directive.js';

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

let schema = makeExecutableSchema({
  typeDefs: await loadSchema('src/typeDefs/schema.gql', {
    loaders: [new GraphQLFileLoader()],
  }),
  resolvers,
});

schema = authDirectiveTransformer(schema, 'isUser');

const server = new ApolloServer({ schema });
const app = express();
const port = process.env.PORT;

await server.start();

app.use(cors(config), json(), cookieParser());
app.use(authMiddleware);
app.use(
  '/graphql',
  expressMiddleware(server, { context: async ({ req, res }) => ({ req, res }) })
);

app.listen({ port }, () =>
  // eslint-disable-next-line no-console
  console.log(`🚀 Server listening on port ${port}`)
);
