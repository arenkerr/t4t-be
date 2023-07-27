import { Resolvers } from '../types/graphql.js';
import userResolvers from './user.resolvers.js';
import dateScalar from './scalar.resolvers.js';
import { authGuard } from './authGuard.resolver.js';

const resolvers: Resolvers = {
  ...dateScalar,
  ...userResolvers,
};

export default resolvers;
