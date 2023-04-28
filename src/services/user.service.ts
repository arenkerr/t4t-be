import { sequelize } from '../database/models/sequelize';
import UserModel from '../database/models/user.model.js';
import { User } from '../types/graphql.js';

class UserService {
    static getUsers(): Promise<User[]> {
        return UserModel.findAll();
    }

    // getUser({ username }): Promise<User> {
    //     return UserModel.findOne({ where: { username } });
    // }

//     createUser({ username, password, email }: CreateUserMutationArgs): Promise<User> {
//     return sequelize.transaction((transaction) => UserModel.create({
//         username,
//         password,
//         email
//     }, { transaction }));
//   }
}

export default UserService;