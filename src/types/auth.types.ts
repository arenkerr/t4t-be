import { JwtPayload } from 'jsonwebtoken';
import { User } from './graphql';

export interface UserJwtPayload extends JwtPayload {
  user: User;
}
