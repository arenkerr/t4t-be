import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import logger from '../util/logger.util.js';
import UserModel from '../database/models/user.model.js';
import SessionModel from '../database/models/session.model.js';
import UserService from '../services/user.service.js';

export interface UserIDJwtPayload extends JwtPayload {
  userId: string;
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
      }) as UserIDJwtPayload;
      const currentTime = new Date().getTime() / 1000;
      const isExp =
        decodedAccessToken.exp && decodedAccessToken.exp < currentTime;

      if (decodedAccessToken && !!isExp) {
        return next();
      }
    }

    // if access token is not valid, verify refresh token
    const { userId } = verify(
      refreshToken,
      refreshTokenSecret
    ) as UserIDJwtPayload;

    if (userId) {
      const user = await UserModel.findOne({
        where: { id: userId },
        include: [{ model: SessionModel, as: 'session' }],
      });

      if (!user) {
        throw Error(`No user found for id ${userId}`);
      }

      const match = await bcrypt.compare(
        refreshToken,
        user.session.refreshToken
      );

      if (!match) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return next();
      }

      // if refresh token is valid, update token cookies and user session
      const tokens = UserService.createTokens(user);
      const sessionId = await UserService.createSession(
        tokens.refreshToken,
        user.sessionId
      );

      const result = await UserModel.update(
        { sessionId },
        { where: { id: user.id } }
      );

      if (!result) {
        throw Error(`Could not update user ${user.id} session id`);
      }

      UserService.setCookies(tokens, res);
    }

    return next();
  } catch (err) {
    logger.error(`authMiddleware - ${err}`);

    return next();
  }
};
