import { JwtPayload } from 'jsonwebtoken';

export interface UserTokenData {
  id: string;
  sessionId: string;
}

declare module 'express-serve-static-core' {
  export interface Request {
    user: UserTokenData;
  }
}

export interface UserJwtPayload extends JwtPayload {
  user: UserTokenData;
}
