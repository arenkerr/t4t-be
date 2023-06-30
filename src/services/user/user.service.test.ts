import { describe, expect, it, jest } from '@jest/globals';
import {
  CreateUserResult,
  MutationCreateUserArgs,
} from '../../types/graphql.js';
import UserService from './user.service.js';
import User from '../../database/models/user.model.js';
import createError from '../../util/error.util.js';
import { UNKNOWN_ERROR } from '../../constants/error.constants.js';
import logger from '../../util/logger.util.js';

const mockUserInput: MutationCreateUserArgs = {
  username: 'username',
  email: 'email@test.com',
  password: 'password123!',
};

const mockUserResult: CreateUserResult = {
  id: '123',
  createdAt: new Date(),
  ...mockUserInput,
};

const mUser = jest.mocked(User);

describe('User service', () => {
  describe('createUser', () => {
    mUser.create = jest.fn();

    describe('when given the correct input', () => {
      it('returns the created user', async () => {
        mUser.create.mockResolvedValueOnce(mockUserResult);
        const result = await UserService.createUser(mockUserInput);

        expect(mUser.create).toBeCalled();
        expect(result).toEqual(mockUserResult);
      });
    });

    describe('when an error occurs', () => {
      const errorMsg = 'oops';
      it('returns an error object', async () => {
        mUser.create.mockRejectedValue(errorMsg);
        const result = await UserService.createUser(mockUserInput);

        expect(result).toEqual(createError(UNKNOWN_ERROR));
      });
      it('logs the error', async () => {
        jest.spyOn(logger, 'error');
        await UserService.createUser(mockUserInput);

        expect(logger.error).toHaveBeenCalled();
        expect(logger.error).toBeCalledWith(
          `UserService.createUser - ${errorMsg}`
        );
      });
    });
  });

  describe('login', () => {
    //
  });
});
