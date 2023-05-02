import { MutationCreateUserArgs, Resolvers, User } from "../types/graphql.js"
import UserService from "../services/user.service.js"

const userResolvers: Resolvers = {
    Query: {
        users: (): Promise<User[]> => UserService.getUsers()
    },
    Mutation: {
        createUser: (_, args: MutationCreateUserArgs): Promise<User | undefined> => UserService.createUser(args)
    }
}

export default userResolvers;