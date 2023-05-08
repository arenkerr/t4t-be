import { MutationCreateUserArgs, MutationLoginArgs, Resolvers, User } from "../types/graphql.js"
import UserService from "../services/user.service.js"

const userResolvers: Resolvers = {
    Query: {
        users: (): Promise<User[] | undefined> => UserService.getUsers()
    },
    Mutation: {
        createUser: (_, args: MutationCreateUserArgs): Promise<User | undefined> => UserService.createUser(args),
        login: (_, args: MutationLoginArgs): Promise<string | undefined> => UserService.login(args)
    }
}

export default userResolvers;