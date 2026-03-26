import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../core/database/prisma/prisma.module';
import { EmailModule } from '../core/email/email.module';
import { RedisModule } from '../core/database/redis/redis.module';
import { InfobipModule } from '../core/infobip/infobip.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { LinkedInStrategy } from './strategies/linkedin.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}), // Secret is passed dynamically in service via ConfigService
    PrismaModule,
    EmailModule,
    RedisModule,
    InfobipModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, GoogleStrategy, LinkedInStrategy, FacebookStrategy],
  exports: [AuthService],
})
export class AuthModule {}
