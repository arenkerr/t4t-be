import { GraphQLSchema, defaultFieldResolver } from 'graphql';
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';

import { UNAUTHORIZED_ERROR } from '../constants/error.constants.js';
import logger from '../util/logger.util.js';

export const authDirectiveTransformer = (
  schema: GraphQLSchema,
  directiveName: string
) => {
  const typeDirectiveArgumentMaps: Record<string, unknown> = {};

  return mapSchema(schema, {
    [MapperKind.TYPE]: (type) => {
      const authDirective = getDirective(schema, type, directiveName)?.[0];
      if (authDirective) {
        typeDirectiveArgumentMaps[type.name] = authDirective;
      }

      return undefined;
    },
    [MapperKind.OBJECT_FIELD]: (fieldConfig, _, typeName) => {
      const authDirective =
        getDirective(schema, fieldConfig, directiveName)?.[0] ??
        typeDirectiveArgumentMaps[typeName];

      if (authDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;

        // if the user is not logged in (the context does not contain user data), return an error message
        // otherwise, return the original resolver
        // TODO: modify to match with the user's role type when roles are added
        fieldConfig.resolve = async function (source, args, context, info) {
          try {
            if (!context.req.user) {
              throw Error(UNAUTHORIZED_ERROR);
            }

            return resolve(source, args, context, info);
          } catch (err) {
            logger.error(`authDirectiveTransformer - ${err}`);
          }
        };
        return fieldConfig;
      }
    },
  });
};
