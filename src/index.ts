import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone'
import * as db from './database/models/sequelize.js';
import { Umzug, SequelizeStorage } from 'umzug';
import { Sequelize } from 'sequelize';
// import up from './database/migrations/users.js'

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
  },
};

// const migrate = (sequelize: Sequelize) => {
//   new Umzug({
//     migrations: {
//       glob: '/database/migrations/*.js',
//     },
//     context: db.sequelize.getQueryInterface(),
//     storage: new SequelizeStorage({ sequelize }),
//     logger: console
//   });
// }

const database = async () => {
  try {
    // if (config.nodeEnv !== 'development') {
    //   const pathToMigration = path.join(__dirname, 'migrations');
    //   await migrate(sequelize, pathToMigration).up().catch((error) => logger.error('Migrate error', error));
    // }

    const { connect, migrate, associate } = db;
    connect();
    migrate.up();
    console.log(migrate.migrations.toString())
    associate();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('database error', error);
  }
};

database();

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

// eslint-disable-next-line no-console
console.log(`🚀 Server listening at: ${url}`);