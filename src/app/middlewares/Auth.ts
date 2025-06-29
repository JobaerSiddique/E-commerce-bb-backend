import { RequestHandler } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import config from '../config';

import AppError from '../errors/AppError';
import { TUserRole } from '../module/user/user.interface';

const Auth = (...requiredRoles: TUserRole[]): RequestHandler => {
  return (req, res, next) => {
    try {
      // 1. Get token from headers
      const token = req.headers.authorization
      
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
      }

      // 2. Verify token
      jwt.verify(token, config.accessToken as string, (err, decoded) => {
        if (err) {
          throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized Access');
        }

        // 3. Check role
        const { role } = decoded as JwtPayload;
        if (requiredRoles.length && !requiredRoles.includes(role)) {
          throw new AppError(httpStatus.FORBIDDEN, 'Forbidden Access');
        }

        // 4. Attach user to request
        req.user = decoded as JwtPayload;
        next();
      });
    } catch (err) {
      next(err);
    }
  };
};

export default Auth;