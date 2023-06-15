// import bcrypt from 'bcrypt';
import { describe, it } from '@jest/globals';
import {
  CreateUserResult,
  MutationCreateUserArgs,
} from '../../types/graphql.js';

const mockUser: MutationCreateUserArgs = {
  username: 'username',
  email: 'email@test.com',
  password: 'password123!',
};

const createdUser: CreateUserResult = {
  id: '123',
  username: 'username',
  email: 'email@test.com',
  password: 'password123!',
  createdAt: new Date(),
};

describe('User service', () => {
  describe('createUser', () => {
    describe('when given the correct input', () => {
      it('returns the created user', async () => {
        //
      });
    });
  });
});
