import { Resolvers } from "../types/graphql.js";
import userResolvers from "./user.resolvers.js";

const resolvers: Resolvers = { ...userResolvers }

export default resolvers;