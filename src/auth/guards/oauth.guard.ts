import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    return {
      session: false,
      state: req.query.redirectUrl || req.query.state || undefined,
    };
  }

  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ) {
    const req = context.switchToHttp().getRequest();
    if (err || !user) {
      req.oauthError = { err, info, user_status: !user ? 'false' : 'true' };
      return null; // Return smoothly to allow Controller logic to intercept and perform 1 precise redirect.
    }
    return user;
  }
}

@Injectable()
export class LinkedInOAuthGuard extends AuthGuard('linkedin') {
  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    return {
      session: false,
      state: req.query.redirectUrl || req.query.state || undefined,
    };
  }

  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ) {
    const req = context.switchToHttp().getRequest();
    if (err || !user) {
      req.oauthError = { err, info, user_status: !user ? 'false' : 'true' };
      return null;
    }
    return user;
  }
}

@Injectable()
export class FacebookOAuthGuard extends AuthGuard('facebook') {
  getAuthenticateOptions(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    return {
      session: false,
      state: req.query.redirectUrl || req.query.state || undefined,
    };
  }

  handleRequest(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ) {
    const req = context.switchToHttp().getRequest();
    if (err || !user) {
      req.oauthError = { err, info, user_status: !user ? 'false' : 'true' };
      return null;
    }
    return user;
  }
}
