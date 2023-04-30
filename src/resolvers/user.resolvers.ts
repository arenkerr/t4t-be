import { MutationCreateUserArgs, Resolvers, User } from "../types/graphql.js"
import UserService from "../services/user.service.js"

const userResolvers: Resolvers = {
    Query: {
        users: (): Promise<User[]> => UserService.getUsers()
    },
    Mutation: {
        createUser: (_, args: MutationCreateUserArgs): Promise<User> => UserService.createUser(args)
    }
}

export default userResolvers;