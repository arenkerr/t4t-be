
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/typeDefs/schema.gql",
  generates: {
    "src/types/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        maybeValue: 'T | null | undefined'
      }
    },
    "./graphql.schema.json": {
      plugins: ["introspection"]
    },
  }
};

export default config;
