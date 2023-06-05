import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import logger from '../util/logger.util.js';
import UserModel from '../database/models/user.model.js';
import SessionModel from '../database/models/session.model.js';
import UserService from '../services/user.service.js';
import { UserJwtPayload } from '../types/auth.types.js';
import { User } from '../types/graphql.js';

declare module 'Express' {
  export interface Request {
    user?: User;
  }
}

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

    // verify access token
    if (accessToken) {
      const decodedAccessToken = verify(accessToken, accessTokenSecret, {
        ignoreExpiration: true,
      }) as UserJwtPayload;
      const currentTime = new Date().getTime() / 1000;
      const isExp =
        decodedAccessToken.exp && decodedAccessToken.exp < currentTime;

      if (decodedAccessToken && !isExp) {
        req.user = decodedAccessToken.user;

        return next();
      }
    }

    // if access token is not valid, verify refresh token
    const { user } = verify(refreshToken, refreshTokenSecret) as UserJwtPayload;

    if (user.id) {
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

      if (!match) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        return next();
      }

      // if refresh token is valid, update token cookies and user session
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
    }

    return next();
  } catch (err) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    logger.error(`authMiddleware - ${err}`);

    return next();
  }
};
