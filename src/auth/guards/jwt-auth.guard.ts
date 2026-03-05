import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException('Token has expired. Please login again.');
    }
    if (info?.name === 'JsonWebTokenError') {
      throw new UnauthorizedException('Invalid token.');
    }
    if (err || !user) {
      throw new UnauthorizedException(
        'Unauthorized. Please provide a valid token.',
      );
    }
    return user;
  }
}

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException(
        'Refresh token has expired. Please login again.',
      );
    }
    if (info?.name === 'JsonWebTokenError') {
      throw new UnauthorizedException('Invalid refresh token.');
    }
    if (err || !user) {
      throw new UnauthorizedException(
        'Unauthorized. Please provide a valid refresh token.',
      );
    }
    return user;
  }
}
