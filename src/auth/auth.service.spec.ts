import {
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

// Mock nanoid before importing AuthService which depends on it
jest.mock('nanoid', () => ({
  customAlphabet: jest.fn(() => () => '123456'),
}));

import { AuthService } from './auth.service';
import { PrismaService } from '../core/database/prisma/prisma.service';
import { EmailService } from '../core/email/email.service';
import { RedisService } from '../core/database/redis/redis.service';
import { InfobipService } from '../core/infobip/infobip.service';

// ─── Helpers ────────────────────────────────────────────────────────────────

const mockUser = (overrides = {}) => ({
  id: 'user-1',
  firstName: 'John',
  lastName: 'Doe',
  username: 'JohnDoe1234',
  email: 'john@example.com',
  phoneNumber: null,
  passwordHash: '$2b$10$hashedpassword',
  mfaSecret: null,
  emailVerifiedAt: new Date(),
  isEmailVerified: false,
  isPhoneVerified: false,
  avatarUrl: null,
  lastLoginAt: null,
  ...overrides,
});

const mockSession = (overrides = {}) => ({
  id: 'session-1',
  userId: 'user-1',
  refreshToken: 'refresh-token',
  isValid: true,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  ...overrides,
});

const mockRedisClient = () => ({
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue('OK'),
  incr: jest.fn().mockResolvedValue(2),
  ttl: jest.fn().mockResolvedValue(30),
});

// ─── Mocks ───────────────────────────────────────────────────────────────────

const prismaServiceMock = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  session: {
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
};

const emailServiceMock = { sendEmail: jest.fn() };
const jwtServiceMock = { sign: jest.fn().mockReturnValue('mock-jwt-token') };
const configServiceMock = {
  get: jest.fn((key: string, defaultValue?: string) => {
    const map: Record<string, string> = {
      BCRYPT_SALT_ROUNDS: '10',
      JWT_SECRET: 'test-secret',
      JWT_REFRESH_SECRET: 'test-refresh-secret',
    };
    return map[key] ?? defaultValue;
  }),
};
const redisServiceMock = { getClient: jest.fn() };
const infobipServiceMock = { sendOtp: jest.fn() };

// ─── Test Suite ──────────────────────────────────────────────────────────────

describe('AuthService', () => {
  let service: AuthService;
  let redisClient: ReturnType<typeof mockRedisClient>;

  beforeEach(async () => {
    redisClient = mockRedisClient();
    redisServiceMock.getClient.mockReturnValue(redisClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prismaServiceMock },
        { provide: EmailService, useValue: emailServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
        { provide: RedisService, useValue: redisServiceMock },
        { provide: InfobipService, useValue: infobipServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    // Reset all mocks before each test
    jest.clearAllMocks();
    redisClient = mockRedisClient();
    redisServiceMock.getClient.mockReturnValue(redisClient);
    jwtServiceMock.sign.mockReturnValue('mock-jwt-token');
  });

  // ─── register ──────────────────────────────────────────────────────────────

  describe('register', () => {
    const dto = {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'Password123!',
    };

    it('should register a new user and send activation email', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);
      emailServiceMock.sendEmail.mockResolvedValue(true);
      prismaServiceMock.user.create.mockResolvedValue(mockUser());

      const result = await service.register(dto);

      expect(prismaServiceMock.user.findUnique).toHaveBeenCalledWith({
        where: { email: dto.email.toLowerCase() },
      });
      expect(emailServiceMock.sendEmail).toHaveBeenCalled();
      expect(prismaServiceMock.user.create).toHaveBeenCalled();
      expect(result.message).toContain('Registered Successfully');
    });

    it('should throw ConflictException if email already exists', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(mockUser());

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });

    it('should throw InternalServerErrorException when email sending fails', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);
      emailServiceMock.sendEmail.mockResolvedValue(false);

      await expect(service.register(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should correctly split single-word fullName', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);
      emailServiceMock.sendEmail.mockResolvedValue(true);
      prismaServiceMock.user.create.mockResolvedValue(mockUser());

      await service.register({ ...dto, fullName: 'Mononym' });

      const createCall = prismaServiceMock.user.create.mock.calls[0][0].data;
      expect(createCall.firstName).toBe('Mononym');
      expect(createCall.lastName).toBe('');
    });
  });

  // ─── verifyActivationCode ───────────────────────────────────────────────────

  describe('verifyActivationCode', () => {
    const futureExpiry = (Date.now() + 10 * 60 * 1000).toString();

    it('should verify code and return tokens', async () => {
      const code = '123456';
      const hash = await bcrypt.hash(code, 10);
      const user = mockUser({
        emailVerifiedAt: null,
        mfaSecret: `${hash}|${futureExpiry}`,
      });

      prismaServiceMock.user.findUnique.mockResolvedValue(user);
      prismaServiceMock.session.create.mockResolvedValue({});
      prismaServiceMock.user.update.mockResolvedValue({});

      const result = await service.verifyActivationCode({
        email: user.email,
        activationCode: code,
      });

      expect(result.message).toBe('Account Activated Successfully');
      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.refresh_token).toBe('mock-jwt-token');
    });

    it('should return already-verified message if email already verified', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(mockUser({ isEmailVerified: true }));

      const result = await service.verifyActivationCode({
        email: 'john@example.com',
        activationCode: '123456',
      });

      expect(result.message).toBe('Account already verified');
    });

    it('should throw NotFoundException if user not found', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.verifyActivationCode({
          email: 'noone@example.com',
          activationCode: '111111',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for expired code', async () => {
      const pastExpiry = (Date.now() - 1000).toString();
      const hash = await bcrypt.hash('123456', 10);
      const user = mockUser({
        emailVerifiedAt: null,
        mfaSecret: `${hash}|${pastExpiry}`,
      });
      prismaServiceMock.user.findUnique.mockResolvedValue(user);

      await expect(
        service.verifyActivationCode({
          email: user.email,
          activationCode: '123456',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for wrong code', async () => {
      const hash = await bcrypt.hash('correct-code', 10);
      const user = mockUser({
        emailVerifiedAt: null,
        mfaSecret: `${hash}|${futureExpiry}`,
      });
      prismaServiceMock.user.findUnique.mockResolvedValue(user);

      await expect(
        service.verifyActivationCode({
          email: user.email,
          activationCode: 'wrong-code',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── login ─────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('should login successfully with valid email and password', async () => {
      const password = 'Password123!';
      const passwordHash = await bcrypt.hash(password, 10);
      const user = mockUser({ passwordHash, isEmailVerified: true });

      prismaServiceMock.user.findUnique.mockResolvedValue(user);
      prismaServiceMock.session.create.mockResolvedValue({});
      prismaServiceMock.user.update.mockResolvedValue({});

      const result = await service.login({
        email: 'john@example.com',
        password,
      });

      expect(result.message).toBe('Login successful');
      expect(result.access_token).toBeDefined();
    });

    it('should throw NotFoundException if user not found', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'unknown@example.com', password: 'pass' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if no passwordHash (OAuth user)', async () => {
      const user = mockUser({ passwordHash: null });
      prismaServiceMock.user.findUnique.mockResolvedValue(user);

      await expect(
        service.login({ email: 'john@example.com', password: 'pass' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for wrong password', async () => {
      const passwordHash = await bcrypt.hash('correct-password', 10);
      const user = mockUser({ passwordHash });
      prismaServiceMock.user.findUnique.mockResolvedValue(user);

      await expect(
        service.login({ email: 'john@example.com', password: 'wrong-password' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── logout ────────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('should logout successfully', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(mockUser());
      prismaServiceMock.session.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.logout('user-1');
      expect(result.message).toBe('User Logout Successfully');
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      await expect(service.logout('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should invalidate specific session when refresh token is provided', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(mockUser());
      prismaServiceMock.session.updateMany.mockResolvedValue({ count: 1 });

      await service.logout('user-1', 'specific-refresh-token');

      expect(prismaServiceMock.session.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', refreshToken: 'specific-refresh-token' },
        data: { isValid: false },
      });
    });
  });

  // ─── sendForgotPasswordCode ─────────────────────────────────────────────────

  describe('sendForgotPasswordCode', () => {
    it('should send forgot password email successfully', async () => {
      redisClient.get.mockResolvedValue(null);
      prismaServiceMock.user.findUnique.mockResolvedValue(mockUser());
      prismaServiceMock.user.update.mockResolvedValue({});
      emailServiceMock.sendEmail.mockResolvedValue(true);

      const result = await service.sendForgotPasswordCode({
        email: 'john@example.com',
      });

      expect(result.message).toBe('Verification Code Sent Successfully');
    });

    it('should throw NotFoundException when user is not found', async () => {
      redisClient.get.mockResolvedValue(null);
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.sendForgotPasswordCode({ email: 'noone@example.com' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw TOO_MANY_REQUESTS when locked', async () => {
      redisClient.get.mockResolvedValue('locked');
      redisClient.ttl.mockResolvedValue(30);

      await expect(
        service.sendForgotPasswordCode({ email: 'john@example.com' }),
      ).rejects.toThrow(HttpException);
    });

    it('should throw TOO_MANY_REQUESTS when daily limit exceeded', async () => {
      redisClient.get.mockImplementation((key: string) => {
        if (key.includes('lock')) return null;
        return '5'; // 5 attempts
      });

      await expect(
        service.sendForgotPasswordCode({ email: 'john@example.com' }),
      ).rejects.toThrow(HttpException);
    });

    it('should throw InternalServerErrorException if email sending fails', async () => {
      redisClient.get.mockResolvedValue(null);
      prismaServiceMock.user.findUnique.mockResolvedValue(mockUser());
      prismaServiceMock.user.update.mockResolvedValue({});
      emailServiceMock.sendEmail.mockResolvedValue(false);

      await expect(
        service.sendForgotPasswordCode({ email: 'john@example.com' }),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  // ─── verifyForgotPasswordCode ───────────────────────────────────────────────

  describe('verifyForgotPasswordCode', () => {
    const futureExpiry = (Date.now() + 10 * 60 * 1000).toString();

    it('should verify code successfully', async () => {
      const code = '654321';
      const hash = await bcrypt.hash(code, 10);
      const user = mockUser({ mfaSecret: `forget|${hash}|${futureExpiry}` });
      prismaServiceMock.user.findUnique.mockResolvedValue(user);

      const result = await service.verifyForgotPasswordCode({
        email: user.email,
        forgetCode: code,
      });

      expect(result.message).toBe('Code Verified Successfully');
    });

    it('should throw NotFoundException if user not found', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.verifyForgotPasswordCode({
          email: 'noone@example.com',
          forgetCode: '123456',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for expired code', async () => {
      const pastExpiry = (Date.now() - 1000).toString();
      const hash = await bcrypt.hash('123456', 10);
      const user = mockUser({ mfaSecret: `forget|${hash}|${pastExpiry}` });
      prismaServiceMock.user.findUnique.mockResolvedValue(user);

      await expect(
        service.verifyForgotPasswordCode({
          email: user.email,
          forgetCode: '123456',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for wrong code', async () => {
      const hash = await bcrypt.hash('correct', 10);
      const user = mockUser({ mfaSecret: `forget|${hash}|${futureExpiry}` });
      prismaServiceMock.user.findUnique.mockResolvedValue(user);

      await expect(
        service.verifyForgotPasswordCode({
          email: user.email,
          forgetCode: 'wrong',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── resetPassword ──────────────────────────────────────────────────────────

  describe('resetPassword', () => {
    const futureExpiry = (Date.now() + 10 * 60 * 1000).toString();

    it("should throw BadRequestException when passwords don't match", async () => {
      await expect(
        service.resetPassword({
          email: 'john@example.com',
          forgetCode: '123456',
          password: 'NewPass123!',
          confirmPassword: 'Different123!',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reset password successfully', async () => {
      const code = '123456';
      const hash = await bcrypt.hash(code, 10);
      const oldPassHash = await bcrypt.hash('OldPass123!', 10);
      const user = mockUser({
        passwordHash: oldPassHash,
        mfaSecret: `forget|${hash}|${futureExpiry}`,
      });

      prismaServiceMock.user.findUnique.mockResolvedValue(user);
      prismaServiceMock.user.update.mockResolvedValue({});
      prismaServiceMock.session.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.resetPassword({
        email: user.email,
        forgetCode: code,
        password: 'NewPass123!',
        confirmPassword: 'NewPass123!',
      });

      expect(result.message).toBe('Password Changed Successfully');
    });

    it('should throw ConflictException when new password is same as old', async () => {
      const code = '123456';
      const codeHash = await bcrypt.hash(code, 10);
      const samePassword = 'SamePass123!';
      const passHash = await bcrypt.hash(samePassword, 10);
      const user = mockUser({
        passwordHash: passHash,
        mfaSecret: `forget|${codeHash}|${futureExpiry}`,
      });

      prismaServiceMock.user.findUnique.mockResolvedValue(user);

      await expect(
        service.resetPassword({
          email: user.email,
          forgetCode: code,
          password: samePassword,
          confirmPassword: samePassword,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  // ─── refreshToken ───────────────────────────────────────────────────────────

  describe('refreshToken', () => {
    it('should issue new token pair for valid session', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(mockUser());
      prismaServiceMock.session.findFirst.mockResolvedValue(mockSession());
      prismaServiceMock.session.update.mockResolvedValue({});

      const result = await service.refreshToken('user-1', 'refresh-token');

      expect(result.access_token).toBeDefined();
      expect(result.refresh_token).toBeDefined();
    });

    it('should throw UnauthorizedException when user not found', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.refreshToken('bad-id', 'any-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid/expired session', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(mockUser());
      prismaServiceMock.session.findFirst.mockResolvedValue(null);

      await expect(
        service.refreshToken('user-1', 'bad-token'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── resendActivationCode ───────────────────────────────────────────────────

  describe('resendActivationCode', () => {
    it('should resend activation code successfully', async () => {
      redisClient.get.mockResolvedValue(null);
      const user = mockUser({ emailVerifiedAt: null });
      prismaServiceMock.user.findUnique.mockResolvedValue(user);
      prismaServiceMock.user.update.mockResolvedValue({});
      emailServiceMock.sendEmail.mockResolvedValue(true);

      const result = await service.resendActivationCode({
        email: 'john@example.com',
      });

      expect(result.message).toBe('Activation Code Resent Successfully');
    });

    it('should return already-verified message', async () => {
      redisClient.get.mockResolvedValue(null);
      prismaServiceMock.user.findUnique.mockResolvedValue(mockUser({ isEmailVerified: true }));

      const result = await service.resendActivationCode({
        email: 'john@example.com',
      });

      expect(result.message).toBe('Account already verified');
    });

    it('should throw TOO_MANY_REQUESTS when locked', async () => {
      redisClient.get.mockResolvedValue('locked');
      redisClient.ttl.mockResolvedValue(60);

      await expect(
        service.resendActivationCode({ email: 'john@example.com' }),
      ).rejects.toThrow(HttpException);
    });

    it('should throw NotFoundException when user not found', async () => {
      redisClient.get.mockResolvedValue(null);
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.resendActivationCode({ email: 'noone@example.com' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─── phoneRegister ──────────────────────────────────────────────────────────

  describe('phoneRegister', () => {
    const dto = {
      fullName: 'John Doe',
      phoneNumber: '+201001234567',
      password: 'Password123!',
    };

    it('should send OTP for new phone number', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);
      infobipServiceMock.sendOtp.mockResolvedValue(true);
      prismaServiceMock.user.create.mockResolvedValue(mockUser());

      const result = await service.phoneRegister(dto);

      expect(result.message).toContain('OTP sent');
      expect(infobipServiceMock.sendOtp).toHaveBeenCalledWith(
        dto.phoneNumber,
        expect.any(String),
      );
    });

    it('should throw ConflictException if phone already registered and verified', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(
        mockUser({ isPhoneVerified: true }),
      );

      await expect(service.phoneRegister(dto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw InternalServerErrorException if OTP send fails', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);
      infobipServiceMock.sendOtp.mockResolvedValue(false);

      await expect(service.phoneRegister(dto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  // ─── phoneLogin ─────────────────────────────────────────────────────────────

  describe('phoneLogin', () => {
    it('should send login OTP to verified phone', async () => {
      const user = mockUser({ isPhoneVerified: true });
      prismaServiceMock.user.findUnique.mockResolvedValue(user);
      prismaServiceMock.user.update.mockResolvedValue({});
      infobipServiceMock.sendOtp.mockResolvedValue(true);

      const result = await service.phoneLogin({ phoneNumber: '+201001234567' });

      expect(result.message).toContain('OTP sent');
    });

    it('should throw NotFoundException if phone not registered', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.phoneLogin({ phoneNumber: '+201009999999' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if phone not verified', async () => {
      prismaServiceMock.user.findUnique.mockResolvedValue(
        mockUser({ isPhoneVerified: false }),
      );

      await expect(
        service.phoneLogin({ phoneNumber: '+201001234567' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ─── googleLogin ────────────────────────────────────────────────────────────

  describe('googleLogin', () => {
    it('should throw BadRequestException when no user in request', async () => {
      await expect(service.googleLogin({ user: null })).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a new user and return tokens for first-time Google login', async () => {
      const req = {
        user: {
          email: 'google@example.com',
          firstName: 'Google',
          lastName: 'User',
          picture: 'https://pic.url',
        },
      };

      prismaServiceMock.user.findUnique.mockResolvedValue(null);
      prismaServiceMock.user.create.mockResolvedValue(
        mockUser({ email: 'google@example.com', isEmailVerified: true }),
      );
      prismaServiceMock.session.create.mockResolvedValue({});
      prismaServiceMock.user.update.mockResolvedValue({});

      const result = await service.googleLogin(req);

      expect(result.message).toBe('Google Login Successfully');
      expect(result.access_token).toBeDefined();
    });

    it('should return tokens for existing Google user', async () => {
      const req = {
        user: {
          email: 'john@example.com',
          firstName: 'John',
          lastName: 'Doe',
          picture: null,
        },
      };

      prismaServiceMock.user.findUnique.mockResolvedValue(
        mockUser({ isEmailVerified: true }),
      );
      prismaServiceMock.session.create.mockResolvedValue({});
      prismaServiceMock.user.update.mockResolvedValue({});

      const result = await service.googleLogin(req);

      expect(result.message).toBe('Google Login Successfully');
    });
  });
});
