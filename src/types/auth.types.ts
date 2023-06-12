import { JwtPayload } from 'jsonwebtoken';
import { User } from './graphql';

declare module 'Express' {
  export interface Request {
    user?: User;
  }
}

export interface UserJwtPayload extends JwtPayload {
  user: User;
}
