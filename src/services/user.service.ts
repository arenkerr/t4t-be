import bcrypt from 'bcrypt';
import { sequelize } from '../database/models/sequelize.js';
import UserModel from '../database/models/user.model.js';
import { MutationCreateUserArgs, User } from '../types/graphql.js';

class UserService {
    static getUsers(): Promise<User[]> {
        return UserModel.findAll();
    }

    static async createUser({ username, password, email, bio, avatarUrl }: MutationCreateUserArgs): Promise<User> {
        const hash = await bcrypt.hash(password, 10);
    
        return sequelize.transaction((transaction) => UserModel.create({
            username,
            password: hash,
            email,
            bio,
            avatarUrl
        }, { transaction }));
  }
}

export default UserService;