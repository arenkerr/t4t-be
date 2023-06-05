import { Request, Response } from 'express';
import { ResolverFn } from '../types/graphql';
import createError from '../util/error.util.js';
import { UNAUTHORIZED_ERROR } from '../constants/error.constants.js';
import { GraphQLResolveInfo } from 'graphql';

export const authGuard =
  (
    next: ResolverFn<unknown, unknown, { req: Request; res: Response }, unknown>
  ) =>
  (
    parent: unknown,
    args: unknown,
    contextValue: { req: Request; res: Response },
    info: GraphQLResolveInfo
  ) => {
    if (!contextValue.req.user) {
      return createError(UNAUTHORIZED_ERROR);
    }

    return next(parent, args, contextValue, info);
  };
