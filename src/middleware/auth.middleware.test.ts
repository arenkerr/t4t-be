import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import mockedEnv, { RestoreFn } from 'mocked-env';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { User } from '../types/graphql.js';
import { authMiddleware } from './auth.middleware.js';
import { Request, Response } from 'express';
import logger from '../util/logger.util.js';
import UserModel from '../database/models/user.model.js';
import UserService from '../services/user/user.service.js';
import { UserTokenData } from '../types/auth.types.js';

const mUserService = jest.mocked(UserService);
const mUser = jest.mocked(UserModel) as jest.MockedClass<typeof UserModel>;

const mockUser: User = {
  id: '123',
  createdAt: new Date(),
  username: 'mockUser',
  password: 'mockPassword',
  email: 'mockEmail',
};

const mockUserTokenData: UserTokenData = {
  id: mockUser.id,
  sessionId: 'mockSessionId',
};

const mockRequest = {
  user: mockUserTokenData,
  cookies: {
    refreshToken: 'mockRefreshToken',
    accessToken: 'mockAccessToken',
  },
} as unknown as Request;

const mockResponse = {
  clearCookie: () => null,
} as unknown as Response;

const mockAccessToken = jwt.sign(
  { user: mockUserTokenData },
  process.env.ACCESS_TOKEN_SECRET as string,
  { expiresIn: '1d' }
);

const mockExpiredAccessToken = jwt.sign(
  { user: mockUserTokenData },
  process.env.ACCESS_TOKEN_SECRET as string,
  { expiresIn: '0ms' }
);

const mockRefreshToken = jwt.sign(
  { user: mockUserTokenData },
  process.env.REFRESH_TOKEN_SECRET as string,
  { expiresIn: '1d' }
);

describe('Auth Middleware', () => {
  describe('when a token secret is missing', () => {
    let restore: RestoreFn;

    beforeEach(() => {
      restore = mockedEnv({
        ACCESS_TOKEN_SECRET: undefined,
        REFRESH_TOKEN_SECRET: undefined,
      });
    });

    it('throws an error', async () => {
      jest.spyOn(logger, 'error');
      await authMiddleware(mockRequest, mockResponse, () => null);

      expect(logger.error).toHaveBeenCalled();
      expect(logger.error).toBeCalledWith(
        `authMiddleware - Error: Missing token secret`
      );
    });

    afterEach(() => {
      restore();
    });
  });

  describe('when user has an access token', () => {
    const next = jest.fn();

    it('returns next function if access token is valid', async () => {
      await authMiddleware(
        {
          ...mockRequest,
          cookies: { accessToken: mockAccessToken },
        } as unknown as Request,
        mockResponse,
        next
      );

      expect(next).toHaveBeenCalled();
    });

    it('logs an error when token is invalid', async () => {
      jest.spyOn(logger, 'error');

      await authMiddleware(mockRequest, mockResponse, () => null);

      expect(logger.error).toHaveBeenCalled();
      expect(logger.error).toBeCalledWith(
        `authMiddleware - JsonWebTokenError: jwt malformed`
      );
    });

    describe('and the access token is expired', () => {
      mUser.findOne = jest.fn();

      it('validates the refresh token', async () => {
        await authMiddleware(
          {
            ...mockRequest,
            cookies: {
              accessToken: mockExpiredAccessToken,
              refreshToken: mockRefreshToken,
            },
          } as unknown as Request,
          mockResponse,
          next
        );
        expect(mUser.findOne).toBeCalled();
      });

      it('logs an error if a matching user is not found', async () => {
        jest.spyOn(logger, 'error');

        await authMiddleware(
          {
            ...mockRequest,
            cookies: {
              accessToken: mockExpiredAccessToken,
              refreshToken: mockRefreshToken,
            },
          } as unknown as Request,
          mockResponse,
          next
        );
        expect(logger.error).toBeCalledWith(
          `authMiddleware - Error: No user found for id ${mockUser.id}`
        );
      });

      it('updates the user session if the refresh token is valid', async () => {
        jest.spyOn(mUserService, 'createTokens');

        mUserService.createSession = jest.fn();
        mUserService.setCookies = jest.fn();
        mUser.update = jest.fn() as never;

        const salt = await bcrypt.genSalt(10);
        const hashedToken = await bcrypt.hash(mockRefreshToken, salt);

        mUser.findOne.mockResolvedValueOnce({
          id: mockUser.id,
          session: { refreshToken: hashedToken },
        } as UserModel);

        mUserService.createSession.mockResolvedValue('mockSessionId');
        mUserService.setCookies.mockReturnValueOnce(undefined);
        mUser.update.mockResolvedValue([1]);

        await authMiddleware(
          {
            ...mockRequest,
            cookies: {
              accessToken: mockExpiredAccessToken,
              refreshToken: mockRefreshToken,
            },
          } as unknown as Request,
          mockResponse,
          next
        );

        expect(mUserService.createTokens).toBeCalled();
      });
    });
  });
});
