import bcrypt from 'bcrypt';
import { sequelize } from '../database/models/sequelize.js';
import UserModel from '../database/models/user.model.js';
import { MutationCreateUserArgs, User } from '../types/graphql.js';
import logger from '../util/logger.js';

class UserService {
    static async getUsers(): Promise<User[] | undefined> {
        try {
            return UserModel.findAll();
        } catch(err) {
            logger.error(`${this.name}.${this.getUsers.name} - ${err}`)
        }
    }

    static async createUser({ username, password, email, bio, avatarUrl }: MutationCreateUserArgs): Promise<User | undefined> {
        try {
            const hash = await bcrypt.hash(password, 10);
    
            const user = await sequelize.transaction((transaction) => UserModel.create({
                username,
                password: hash,
                email,
                bio,
                avatarUrl
            }, { transaction }));

            return user;
        } catch(err) {
            logger.error(`${this.name}.${this.createUser.name} - ${err}`)
        }
  }
}

export default UserService;