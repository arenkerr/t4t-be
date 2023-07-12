import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import logger from '../util/logger.util.js';
import UserModel from '../database/models/user.model.js';
import SessionModel from '../database/models/session.model.js';
import UserService from '../services/user/user.service.js';
import { UserJwtPayload } from '../types/auth.types.js';
import { User } from '../types/graphql.js';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!accessTokenSecret || !refreshTokenSecret) {
      throw Error('Missing token secret');
    }

    const refreshToken = req.cookies['refreshToken'];
    const accessToken = req.cookies['accessToken'];

    if (!accessToken && !refreshToken) {
      return next();
    }

    if (accessToken) {
      verifyAccessToken(accessToken, accessTokenSecret, req, next);
    }

    // if access token is expired, verify refresh token instead
    const { user } = verify(refreshToken, refreshTokenSecret) as UserJwtPayload;

    if (user.id) {
      const foundUser = await validateRefreshTokenUser(
        user,
        refreshToken,
        res,
        next
      );

      // if refresh token is valid, update token cookies and user session
      if (foundUser) {
        updateUserSession(foundUser, req, res);
      }

      return next();
    }
  } catch (err) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    logger.error(`authMiddleware - ${err}`);

    return next();
  }
};

const verifyAccessToken = (
  token: string,
  secret: string,
  req: Request,
  next: NextFunction
) => {
  const decodedAccessToken = verify(token, secret, {
    ignoreExpiration: true,
  }) as UserJwtPayload;
  const currentTime = new Date().getTime() / 1000;
  const isExp = decodedAccessToken.exp && decodedAccessToken.exp < currentTime;

  if (decodedAccessToken && !isExp) {
    req.user = decodedAccessToken.user;

    // if access token is valid & unexpired, continue
    return next();
  }
};

const validateRefreshTokenUser = async (
  user: User,
  refreshToken: string,
  res: Response,
  next: NextFunction
) => {
  const foundUser = await UserModel.findOne({
    where: { id: user.id },
    include: [{ model: SessionModel, as: 'session' }],
  });

  if (!foundUser) {
    throw Error(`No user found for id ${user.id}`);
  }

  const match = await bcrypt.compare(
    refreshToken,
    foundUser.session.refreshToken
  );

  // if user's stored token does not match, clear cookies and return next
  if (!match) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return next();
  }

  return foundUser;
};

const updateUserSession = async (
  foundUser: UserModel,
  req: Request,
  res: Response
) => {
  const tokens = UserService.createTokens(foundUser);
  const sessionId = await UserService.createSession(
    tokens.refreshToken,
    foundUser.sessionId
  );

  const result = await UserModel.update(
    { sessionId },
    { where: { id: foundUser.id } }
  );

  if (!result) {
    throw Error(`Could not update user ${foundUser.id} session id`);
  }

  req.user = foundUser;
  UserService.setCookies(tokens, res);
};
