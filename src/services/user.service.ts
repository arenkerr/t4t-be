import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sequelize } from '../database/models/sequelize.js';
import UserModel from '../database/models/user.model.js';
import {
  CreateUserResult,
  LoginResult,
  MutationCreateUserArgs,
  User,
} from '../types/graphql.js';
import logger from '../util/logger.util.js';
import createError from '../util/error.util.js';
import {
  DUPLICATE_EMAIL_ERROR,
  INVALID_CREDENTIALS_ERROR,
  UNKNOWN_ERROR,
  USERNAME_EXISTS_ERROR,
} from '../constants/error.constants.js';
import { LOGIN_TOKEN_EXP } from '../constants/auth.constants.js';

class UserService {
  static async getUsers(): Promise<User[] | undefined> {
    try {
      return UserModel.findAll();
    } catch (err) {
      logger.error(`${this.name}.${this.getUsers.name} - ${err}`);
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

  static async login({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<LoginResult> {
    try {
      const secret = process.env.TOKEN_SECRET;

      if (!secret) {
        throw Error('No secret token');
      }

      const user = await UserModel.findOne({ where: { username } });

      if (user) {
        const match = await bcrypt.compare(password, user.password);

        if (match) {
          const accessToken = {
            token: jwt.sign({ user: { id: user.id } }, secret, {
              expiresIn: LOGIN_TOKEN_EXP,
            }),
            // TODO: add user role, refresh token
          };
          return accessToken;
        }
      }

      return createError(INVALID_CREDENTIALS_ERROR);
    } catch (err) {
      logger.error(`${this.name}.${this.login.name} - ${err}`);

      return createError(UNKNOWN_ERROR);
    }
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
