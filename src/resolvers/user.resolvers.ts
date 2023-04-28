import { Resolvers, User } from "../types/graphql.js"
import UserService from "../services/user.service.js"

const userResolvers: Resolvers = {
    Query: {
        users: (): Promise<User[]> => UserService.getUsers()
    }
}

export default userResolvers;