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

  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
    if (err || !user) {
      const errorMsg = err?.message || info?.message || 'unknown_error';
      console.error('Google OAuthGuard Error:', { err, info });
      
      const req = context.switchToHttp().getRequest();
      const res = context.switchToHttp().getResponse();
      const redirectBaseUrl = (req.query.state as string) || '/';
      const separator = redirectBaseUrl.includes('?') ? '&' : '?';
      res.redirect(`${redirectBaseUrl}${separator}error=oauth_failed&reason=${encodeURIComponent(errorMsg)}`);
      return null;
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

  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
    if (err || !user) {
      const errorMsg = err?.message || info?.message || 'unknown_error';
      console.error('LinkedIn OAuthGuard Error:', { err, info });
      
      const req = context.switchToHttp().getRequest();
      const res = context.switchToHttp().getResponse();
      const redirectBaseUrl = (req.query.state as string) || '/';
      const separator = redirectBaseUrl.includes('?') ? '&' : '?';
      res.redirect(`${redirectBaseUrl}${separator}error=oauth_failed&reason=${encodeURIComponent(errorMsg)}`);
      return null;
    }
    return user;
  }
}
