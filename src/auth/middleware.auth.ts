import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

const validateToken = (token: string) => {
  const secret = process.env.TOKEN_SECRET;

  if (!secret) {
    throw Error('No secret token');
  }
  return verify(token, secret);
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO: validate tokens
  // const refreshToken = req.cookies['refreshToken'];
  // const accessToken = req.cookies['accessToken'];

  return next();
};
