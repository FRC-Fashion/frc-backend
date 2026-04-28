import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// ─── AuthService Mock ────────────────────────────────────────────────────────

const authServiceMock = {
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  verifyActivationCode: jest.fn(),
  resendActivationCode: jest.fn(),
  sendForgotPasswordCode: jest.fn(),
  verifyForgotPasswordCode: jest.fn(),
  resetPassword: jest.fn(),
  refreshToken: jest.fn(),
  googleLogin: jest.fn(),
  linkedinLogin: jest.fn(),
  facebookLogin: jest.fn(),
  phoneRegister: jest.fn(),
  verifyPhoneOtp: jest.fn(),
  phoneLogin: jest.fn(),
  verifyPhoneLoginOtp: jest.fn(),
  phoneForgotPassword: jest.fn(),
  phoneResetPassword: jest.fn(),
};

const configServiceMock = {
  get: jest.fn((key: string) => {
    const map: Record<string, string> = {
      NODE_ENV: 'test',
      COOKIE_DOMAIN: '',
    };
    return map[key] ?? null;
  }),
};

// ─── Test Suite ──────────────────────────────────────────────────────────────

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  // ─── register ──────────────────────────────────────────────────────────────

  describe('register', () => {
    it('should call authService.register with the dto', async () => {
      const dto = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      };
      const expected = {
        message:
          'User Registered Successfully. Please check your email for activation code',
      };
      authServiceMock.register.mockResolvedValue(expected);

      const result = await controller.register(dto as any);

      expect(authServiceMock.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  // ─── login ─────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('should call authService.login and return tokens', async () => {
      const dto = { email: 'john@example.com', password: 'Password123!' };
      const expected = {
        message: 'Login successful',
        access_token: 'access',
        refresh_token: 'refresh',
      };
      authServiceMock.login.mockResolvedValue(expected);

      const result = await controller.login(dto as any);

      expect(authServiceMock.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  // ─── logout ────────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('should call authService.logout with the user id from request', async () => {
      const req = { user: { id: 'user-1' } };
      const expected = { message: 'User Logout Successfully' };
      authServiceMock.logout.mockResolvedValue(expected);

      const result = await controller.logout(req);

      expect(authServiceMock.logout).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(expected);
    });
  });

  // ─── verifyActivationCode ───────────────────────────────────────────────────

  describe('verifyActivationCode', () => {
    it('should call authService.verifyActivationCode with dto', async () => {
      const dto = { email: 'john@example.com', activationCode: '123456' };
      const expected = { message: 'Account Activated Successfully' };
      authServiceMock.verifyActivationCode.mockResolvedValue(expected);

      const result = await controller.verifyActivationCode(dto as any);

      expect(authServiceMock.verifyActivationCode).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  // ─── resendActivationCode ───────────────────────────────────────────────────

  describe('resendActivationCode', () => {
    it('should call authService.resendActivationCode with dto', async () => {
      const dto = { email: 'john@example.com' };
      const expected = { message: 'Activation Code Resent Successfully' };
      authServiceMock.resendActivationCode.mockResolvedValue(expected);

      const result = await controller.resendActivationCode(dto as any);

      expect(authServiceMock.resendActivationCode).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  // ─── sendForgotPasswordCode ─────────────────────────────────────────────────

  describe('sendForgotPasswordCode', () => {
    it('should call authService.sendForgotPasswordCode with dto', async () => {
      const dto = { email: 'john@example.com' };
      const expected = { message: 'Verification Code Sent Successfully' };
      authServiceMock.sendForgotPasswordCode.mockResolvedValue(expected);

      const result = await controller.sendForgotPasswordCode(dto as any);

      expect(authServiceMock.sendForgotPasswordCode).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  // ─── verifyForgotPasswordCode ───────────────────────────────────────────────

  describe('verifyForgotPasswordCode', () => {
    it('should call authService.verifyForgotPasswordCode with dto', async () => {
      const dto = { email: 'john@example.com', forgetCode: '654321' };
      const expected = { message: 'Code Verified Successfully' };
      authServiceMock.verifyForgotPasswordCode.mockResolvedValue(expected);

      const result = await controller.verifyForgotPasswordCode(dto as any);

      expect(authServiceMock.verifyForgotPasswordCode).toHaveBeenCalledWith(
        dto,
      );
      expect(result).toEqual(expected);
    });
  });

  // ─── resetPassword ──────────────────────────────────────────────────────────

  describe('resetPassword', () => {
    it('should call authService.resetPassword with dto', async () => {
      const dto = {
        email: 'john@example.com',
        forgetCode: '123456',
        password: 'NewPass123!',
        confirmPassword: 'NewPass123!',
      };
      const expected = { message: 'Password Changed Successfully' };
      authServiceMock.resetPassword.mockResolvedValue(expected);

      const result = await controller.resetPassword(dto as any);

      expect(authServiceMock.resetPassword).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  // ─── refresh ────────────────────────────────────────────────────────────────

  describe('refresh', () => {
    it('should extract token from Authorization header and call authService.refreshToken', async () => {
      const req = { user: { id: 'user-1' } };
      const authHeader = 'FRC old-refresh-token';
      const expected = {
        access_token: 'new-access',
        refresh_token: 'new-refresh',
      };
      authServiceMock.refreshToken.mockResolvedValue(expected);

      const result = await controller.refresh(req, authHeader);

      expect(authServiceMock.refreshToken).toHaveBeenCalledWith(
        'user-1',
        'old-refresh-token',
      );
      expect(result).toEqual(expected);
    });

    it('should handle missing Authorization header gracefully', async () => {
      const req = { user: { id: 'user-1' } };
      authServiceMock.refreshToken.mockResolvedValue({});

      await controller.refresh(req, undefined as any);

      // undefined?.replace returns undefined — service is still called
      expect(authServiceMock.refreshToken).toHaveBeenCalledWith(
        'user-1',
        undefined,
      );
    });
  });

  // ─── phoneRegister ──────────────────────────────────────────────────────────

  describe('phoneRegister', () => {
    it('should call authService.phoneRegister with dto', async () => {
      const dto = {
        fullName: 'Jane Doe',
        phoneNumber: '+201001234567',
        password: 'Password123!',
      };
      const expected = {
        message:
          'OTP sent to your WhatsApp. Please verify to complete registration.',
      };
      authServiceMock.phoneRegister.mockResolvedValue(expected);

      const result = await controller.phoneRegister(dto as any);

      expect(authServiceMock.phoneRegister).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  // ─── verifyPhoneOtp ─────────────────────────────────────────────────────────

  describe('verifyPhoneOtp', () => {
    it('should call authService.verifyPhoneOtp with dto', async () => {
      const dto = { phoneNumber: '+201001234567', otp: '123456' };
      const expected = {
        message: 'Phone verified and account activated successfully',
      };
      authServiceMock.verifyPhoneOtp.mockResolvedValue(expected);

      const result = await controller.verifyPhoneOtp(dto as any);

      expect(authServiceMock.verifyPhoneOtp).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  // ─── phoneLogin ─────────────────────────────────────────────────────────────

  describe('phoneLogin', () => {
    it('should call authService.phoneLogin with dto', async () => {
      const dto = { phoneNumber: '+201001234567' };
      const expected = {
        message: 'OTP sent to your WhatsApp. Please verify to login.',
      };
      authServiceMock.phoneLogin.mockResolvedValue(expected);

      const result = await controller.phoneLogin(dto as any);

      expect(authServiceMock.phoneLogin).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  // ─── verifyPhoneLoginOtp ────────────────────────────────────────────────────

  describe('verifyPhoneLoginOtp', () => {
    it('should call authService.verifyPhoneLoginOtp with dto', async () => {
      const dto = { phoneNumber: '+201001234567', otp: '654321' };
      const expected = { message: 'Login successful' };
      authServiceMock.verifyPhoneLoginOtp.mockResolvedValue(expected);

      const result = await controller.verifyPhoneLoginOtp(dto as any);

      expect(authServiceMock.verifyPhoneLoginOtp).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  // ─── phoneForgotPassword ────────────────────────────────────────────────────

  describe('phoneForgotPassword', () => {
    it('should call authService.phoneForgotPassword with dto', async () => {
      const dto = { phoneNumber: '+201001234567' };
      const expected = {
        message:
          'OTP sent to your WhatsApp. Please verify to reset your password.',
      };
      authServiceMock.phoneForgotPassword.mockResolvedValue(expected);

      const result = await controller.phoneForgotPassword(dto as any);

      expect(authServiceMock.phoneForgotPassword).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  // ─── phoneResetPassword ─────────────────────────────────────────────────────

  describe('phoneResetPassword', () => {
    it('should call authService.phoneResetPassword with dto', async () => {
      const dto = {
        phoneNumber: '+201001234567',
        otp: '123456',
        password: 'NewPass123!',
        confirmPassword: 'NewPass123!',
      };
      const expected = { message: 'Password reset successfully' };
      authServiceMock.phoneResetPassword.mockResolvedValue(expected);

      const result = await controller.phoneResetPassword(dto as any);

      expect(authServiceMock.phoneResetPassword).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });
});
