import {
  CreateUserResult,
  LoginResult,
  MutationCreateUserArgs,
  MutationLoginArgs,
  Resolvers,
  User,
} from '../types/graphql.js';
import UserService from '../services/user.service.js';
import {
  INVALID_CREDENTIALS_ERROR,
  UNAUTHORIZED_ERROR,
  UNKNOWN_ERROR,
} from '../constants/error.constants.js';
import UserEntity from '../database/models/user.model.js';

const userResolvers: Resolvers = {
  Query: {
    users: (): Promise<User[] | undefined> => UserService.getUsers(),
  },
  Mutation: {
    createUser: (_, args: MutationCreateUserArgs): Promise<CreateUserResult> =>
      UserService.createUser(args),
    login: (_, args: MutationLoginArgs, contextValue): Promise<LoginResult> =>
      UserService.login(args, contextValue),
  },
  User: {
    __isTypeOf: (parent) => parent instanceof UserEntity,
    id: (parent) => parent.id,
    username: (parent) => parent.username,
    email: (parent) => parent.email,
  },
  LoginData: {
    __isTypeOf: (parent) => !!(parent.sessionId && parent.userId),
    sessionId: (parent) => parent.sessionId,
    userId: (parent) => parent.userId,
  },
  UnknownError: {
    __isTypeOf: (parent) => parent.message === UNKNOWN_ERROR,
    message: (parent) => parent.message,
  },
  InvalidCredentialsError: {
    __isTypeOf: (parent) => parent.message === INVALID_CREDENTIALS_ERROR,
    message: (parent) => parent.message,
  },
  UnauthorizedError: {
    __isTypeOf: (parent) => parent.message === UNAUTHORIZED_ERROR,
    message: (parent) => parent.message,
  },
};

export default userResolvers;
