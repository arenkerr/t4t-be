import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone'
import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { makeExecutableSchema } from '@graphql-tools/schema'
import resolvers from './resolvers/index.js';
import * as db from './database/models/sequelize.js';

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

export const schema = makeExecutableSchema({
  typeDefs: await loadSchema('src/typeDefs/schema.gql', { loaders: [new GraphQLFileLoader()]}),
  resolvers
});

const server = new ApolloServer({ schema });

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

// eslint-disable-next-line no-console
console.log(`🚀 Server listening at: ${url}`);
