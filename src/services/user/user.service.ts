import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sequelize } from '../../database/models/sequelize.js';
import UserModel from '../../database/models/user.model.js';
import {
  CreateUserResult,
  LoginResult,
  MutationCreateUserArgs,
  MutationLoginArgs,
  QueryUserResult,
  UnknownError,
  User,
} from '../../types/graphql.js';
import logger from '../../util/logger.util.js';
import createError from '../../util/error.util.js';
import {
  DUPLICATE_EMAIL_ERROR,
  INVALID_CREDENTIALS_ERROR,
  UNKNOWN_ERROR,
  USERNAME_EXISTS_ERROR,
} from '../../constants/error.constants.js';
import {
  ACCESS_TOKEN_EXP,
  REFRESH_TOKEN_EXP,
} from '../../constants/auth.constants.js';
import SessionModel from '../../database/models/session.model.js';
import { Response } from 'express';
import { ExpressContextFunctionArgument } from '@apollo/server/dist/esm/express4/index.js';

class UserService {
  static async getUsers(): Promise<User[] | undefined> {
    try {
      return UserModel.findAll();
    } catch (err) {
      logger.error(`${this.name}.${this.getUsers.name} - ${err}`);
    }
  }

  static async getUser(
    id: string
  ): Promise<QueryUserResult | UnknownError | null> {
    try {
      return UserModel.findOne({
        where: { id },
      });
    } catch (err) {
      logger.error(`${this.name}.${this.getUsers.name} - ${err}`);

      return createError(UNKNOWN_ERROR);
    }
  }

  static async createUser({
    username,
    password,
    email,
    bio,
    avatarUrl,
  }: MutationCreateUserArgs): Promise<CreateUserResult> {
    try {
      const hash = await bcrypt.hash(password, 10);
      const user = await sequelize.transaction((transaction) =>
        UserModel.create(
          {
            username,
            password: hash,
            email,
            bio,
            avatarUrl,
          },
          { transaction }
        )
      );

      // TODO: send verification email
      return user;
    } catch (err) {
      logger.error(`${this.name}.${this.createUser.name} - ${err}`);

      return createError(UNKNOWN_ERROR);
    }
  }

  static async login(
    { username, password }: MutationLoginArgs,
    { res }: ExpressContextFunctionArgument
  ): Promise<LoginResult> {
    try {
      const user = await UserModel.findOne({
        where: { username },
      });

      if (user) {
        const match = await bcrypt.compare(password, user.password);

        if (match) {
          const tokens = this.createTokens(user);
          const sessionId = await this.createSession(
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

          this.setCookies(tokens, res);

          return { userId: user.id, sessionId };
        }
      }

      return createError(INVALID_CREDENTIALS_ERROR);
    } catch (err) {
      logger.error(`${this.name}.${this.login.name} - ${err}`);

      return createError(UNKNOWN_ERROR);
    }
  }

  static async createSession(
    refreshToken: string,
    previousSessionId: string
  ): Promise<string> {
    const encryptedToken = await bcrypt.hash(refreshToken, 10);

    const { id } = await sequelize.transaction((transaction) => {
      if (previousSessionId) {
        SessionModel.destroy({ where: { id: previousSessionId } });
      }
      const session = SessionModel.create(
        { refreshToken: encryptedToken },
        { transaction }
      );
      return session;
    });

    return id;
  }

  static createTokens(user: UserModel): {
    accessToken: string;
    refreshToken: string;
  } {
    // TODO: add user role to token payload
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!accessTokenSecret || !refreshTokenSecret) {
      throw Error('Missing token secret');
    }

    const payload = { user: { id: user.id, sessionId: user.sessionId } };

    return {
      accessToken: jwt.sign(payload, accessTokenSecret, {
        expiresIn: ACCESS_TOKEN_EXP,
      }),
      refreshToken: jwt.sign(payload, refreshTokenSecret, {
        expiresIn: REFRESH_TOKEN_EXP,
      }),
    };
  }

  static setCookies(
    {
      accessToken,
      refreshToken,
    }: { accessToken: string; refreshToken: string },
    res: Response
  ): void {
    const options = {
      httpOnly: true,
    };
    res.cookie('accessToken', accessToken, options);
    res.cookie('refreshToken', refreshToken, options);
  }

  // TODO: create queries to validate username/email
  static async validateUsername(username: string) {
    const usernameExists = await UserModel.findOne({ where: { username } });
    if (usernameExists) {
      return createError(USERNAME_EXISTS_ERROR);
    }
  }

  static async validateEmail(email: string) {
    const emailExists = await UserModel.findOne({ where: { email } });
    if (emailExists) {
      return createError(DUPLICATE_EMAIL_ERROR);
    }
  }
}

export default UserService;
