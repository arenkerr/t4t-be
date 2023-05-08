import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

  static async login({ username, password }: { username: string, password: string } ){
    try {
        const secret = process.env.TOKEN_SECRET;

        if (!secret) {
            throw Error('No secret token')
        }

        const user = await UserModel.findOne({ where: { username } });

        if (user) {
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                const accessToken = jwt.sign({ user: { id: user.id }}, secret)
                return accessToken;
            } 
        }

        return 'Invalid credentials'
    } catch(err) {
        logger.error(`${this.name}.${this.login.name} - ${err}`)
    }
  }
}

export default UserService;