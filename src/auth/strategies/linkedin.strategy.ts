import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LinkedInStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID:
        configService.get<string>('LINKEDIN_CLIENT_ID') ||
        'placeholder_client_id',
      clientSecret:
        configService.get<string>('LINKEDIN_CLIENT_SECRET') ||
        'placeholder_client_secret',
      callbackURL: `${(configService.get<string>('APP_URL') || 'http://localhost:3000').replace(/\/$/, '')}/${(configService.get<string>('API_PREFIX') || 'api/v1').replace(/^\//, '')}/auth/linkedin/callback`,
      scope: ['openid', 'profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: (error: any, user?: any, info?: any) => void,
  ): Promise<any> {
    const { givenName, familyName, email, picture } = profile;
    const user = {
      email,
      firstName: givenName,
      lastName: familyName,
      picture,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
