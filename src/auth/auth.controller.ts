import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Req,
  Res,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard, JwtRefreshAuthGuard } from './guards/jwt-auth.guard';
import { GoogleOAuthGuard, LinkedInOAuthGuard } from './guards/oauth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyActivationDto } from './dto/verify-activation.dto';
import { ResendActivationDto } from './dto/resend-activation.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyForgotCodeDto } from './dto/verify-forgot-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { PhoneRegisterDto } from './dto/phone-register.dto';
import { PhoneLoginDto } from './dto/phone-login.dto';
import { VerifyPhoneOtpDto } from './dto/verify-phone-otp.dto';
import { PhoneForgotPasswordDto } from './dto/phone-forgot-password.dto';
import { PhoneResetPasswordDto } from './dto/phone-reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // ─── Register ───────────────────────────────────────────────────────────────
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User Registered Successfully' })
  @ApiResponse({ status: 409, description: 'Email is Already Exist' })
  @ApiResponse({ status: 400, description: "Passwords Don't Match" })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // ─── Login ───────────────────────────────────────────────────────────────────
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user with email or phone + password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 404, description: 'No account found' })
  @ApiResponse({
    status: 400,
    description: 'Not verified / Invalid credentials / Wrong login method',
  })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // ─── Logout ──────────────────────────────────────────────────────────────────
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User Logout Successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Req() req: any) {
    return this.authService.logout(req.user.id);
  }

  // ─── Verify Activation Code ──────────────────────────────────────────────────
  @Post('email-verification/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify activation code' })
  @ApiBody({ type: VerifyActivationDto })
  @ApiResponse({ status: 200, description: 'Account Activated Successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired code' })
  @ApiResponse({ status: 404, description: 'Not Register Account' })
  async verifyActivationCode(@Body() dto: VerifyActivationDto) {
    return this.authService.verifyActivationCode(dto);
  }

  // ─── Resend Activation Code ──────────────────────────────────────────────────
  @Post('email-verification/resend')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resend activation code' })
  @ApiBody({ type: ResendActivationDto })
  @ApiResponse({
    status: 200,
    description: 'Activation Code Resent Successfully',
  })
  @ApiResponse({ status: 404, description: 'Not Register Account' })
  async resendActivationCode(@Body() dto: ResendActivationDto) {
    return this.authService.resendActivationCode(dto);
  }

  // ─── Forgot Password ─────────────────────────────────────────────────────────
  @Post('password/forgot')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send forgot password code' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Verification Code Sent Successfully',
  })
  @ApiResponse({ status: 404, description: 'Not Register Account' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async sendForgotPasswordCode(@Body() dto: ForgotPasswordDto) {
    return this.authService.sendForgotPasswordCode(dto);
  }

  // ─── Verify Forgot Password Code ─────────────────────────────────────────────
  @Post('password/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify forgot password code' })
  @ApiBody({ type: VerifyForgotCodeDto })
  @ApiResponse({ status: 200, description: 'Code Verified Successfully' })
  @ApiResponse({ status: 400, description: 'Invalid code or expired' })
  @ApiResponse({ status: 404, description: 'Not Register Account' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async verifyForgotPasswordCode(@Body() dto: VerifyForgotCodeDto) {
    return this.authService.verifyForgotPasswordCode(dto);
  }

  // ─── Reset Password ───────────────────────────────────────────────────────────
  @Patch('password/reset')
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password Changed Successfully' })
  @ApiResponse({ status: 400, description: 'Invalid code or expired' })
  @ApiResponse({ status: 404, description: 'Not Register Account' })
  @ApiResponse({
    status: 409,
    description: 'New password cannot be the same as old one',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // ─── Refresh Token ────────────────────────────────────────────────────────────
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshAuthGuard)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'New token pair issued' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async refresh(@Req() req: any, @Headers('authorization') authHeader: string) {
    const oldRefreshToken = authHeader?.replace('FRC ', '');
    return this.authService.refreshToken(req.user.id, oldRefreshToken);
  }

  // ─── Google Login ────────────────────────────────────────────────────────────
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({
    summary: 'Initiate Google Login',
    description: `
**FRONTEND INSTRUCTIONS:**
1. Do **NOT** use Axios or Fetch to call this endpoint.
2. Use a direct browser redirect and pass the \`redirectUrl\` query parameter indicating where the user should be redirected after login.
   - Example: \`<a href="API_URL/api/v1/auth/google?redirectUrl=https://your-frontend.com/dashboard">Login with Google</a>\`
3. After successful login, the backend will redirect the user to the \`redirectUrl\` you provided.
4. The backend sets **cross-subdomain Cookies** named \`access_token\` and \`refresh_token\`. They are valid for **60 seconds** and have \`httpOnly: false\`.
5. The frontend should instantly read these cookies via \`document.cookie\` or a cookie parsing library, save them to \`localStorage\`, and then act as if the user just logged in.
    `,
  })
  async googleAuth(@Req() req: any) {
    // Execution will be intercepted by Google OAuth Strategy
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({
    summary: 'Google Callback (System Only)',
    description:
      'Google redirects here after login. Do not call this manually.',
  })
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    const redirectBaseUrl = (req.query.state as string) || '/';
    
    try {
      if (!req.user) {
        throw new Error('No user from Google');
      }
      
      const result = await this.authService.googleLogin(req);
      const isProd = this.configService.get<string>('NODE_ENV') === 'production';
      const host = req.headers.host || '';
      
      // If we are on any fashionretailclub domain (e.g. dev., api., www.), share the cookie
      const isFRCRoot = host.includes('fashionretailclub.com');
      const cookieDomain = isFRCRoot ? '.fashionretailclub.com' : undefined;
  
      // Set configuration for cross-subdomain cookies
      const cookieOptions = {
        domain: cookieDomain,
        httpOnly: false, // Must be false so frontend JS can read it and save it to LocalStorage
        secure: isProd || isFRCRoot, // True on production or HTTPS domains
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 60 * 1000, // 60 seconds is enough for frontend to capture the tokens
      };
  
      res.cookie('access_token', result.access_token, cookieOptions);
      res.cookie('refresh_token', result.refresh_token, cookieOptions);
  
      // Redirect cleanly without any URL parameters
      return res.redirect(redirectBaseUrl);
    } catch (error: any) {
      console.error('Google Auth Error:', error);
      const separator = redirectBaseUrl.includes('?') ? '&' : '?';
      return res.redirect(`${redirectBaseUrl}${separator}error=oauth_failed&reason=${encodeURIComponent(error?.message || 'unknown_error')}`);
    }
  }

  // ─── LinkedIn Login ──────────────────────────────────────────────────────────
  @Get('linkedin')
  @UseGuards(LinkedInOAuthGuard)
  @ApiOperation({
    summary: 'Initiate LinkedIn Login',
    description: `
**FRONTEND INSTRUCTIONS:**
1. Do **NOT** use Axios or Fetch to call this endpoint.
2. Use a direct browser redirect and pass the \`redirectUrl\` query parameter indicating where the user should be redirected after login.
   - Example: \`<a href="API_URL/api/v1/auth/linkedin?redirectUrl=https://your-frontend.com/dashboard">Login with LinkedIn</a>\`
3. After successful login, the backend will redirect the user to the \`redirectUrl\` you provided.
4. The backend sets **cross-subdomain Cookies** named \`access_token\` and \`refresh_token\`. They are valid for **60 seconds** and have \`httpOnly: false\`.
5. The frontend should instantly read these cookies via \`document.cookie\` or a cookie parsing library, save them to \`localStorage\`, and then act as if the user just logged in.
    `,
  })
  async linkedinAuth(@Req() req: any) {
    // Execution will be intercepted by LinkedIn OAuth Strategy
  }

  @Get('linkedin/callback')
  @UseGuards(LinkedInOAuthGuard)
  @ApiOperation({
    summary: 'LinkedIn Callback (System Only)',
    description:
      'LinkedIn redirects here after login. Do not call this manually.',
  })
  async linkedinAuthRedirect(@Req() req: any, @Res() res: any) {
    const redirectBaseUrl = (req.query.state as string) || '/';
    
    try {
      if (!req.user) {
        throw new Error('No user from LinkedIn');
      }

      const result = await this.authService.linkedinLogin(req);
      const isProd = this.configService.get<string>('NODE_ENV') === 'production';
      const host = req.headers.host || '';
      
      const isFRCRoot = host.includes('fashionretailclub.com');
      const cookieDomain = isFRCRoot ? '.fashionretailclub.com' : undefined;
  
      // Set configuration for cross-subdomain cookies
      const cookieOptions = {
        domain: cookieDomain,
        httpOnly: false,
        secure: isProd || isFRCRoot,
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 60 * 1000, // 60 seconds
      };
  
      res.cookie('access_token', result.access_token, cookieOptions);
      res.cookie('refresh_token', result.refresh_token, cookieOptions);
  
      // Redirect cleanly without any URL parameters
      return res.redirect(redirectBaseUrl);
    } catch (error: any) {
      console.error('LinkedIn Auth Error:', error);
      const separator = redirectBaseUrl.includes('?') ? '&' : '?';
      return res.redirect(`${redirectBaseUrl}${separator}error=oauth_failed&reason=${encodeURIComponent(error?.message || 'unknown_error')}`);
    }
  }

  // ─── Phone Register ─────────────────────────────────────────────────────────
  @Post('phone/register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register with phone number (sends WhatsApp OTP)' })
  @ApiBody({ type: PhoneRegisterDto })
  @ApiResponse({ status: 200, description: 'OTP sent to WhatsApp' })
  @ApiResponse({ status: 409, description: 'Phone number already registered' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async phoneRegister(@Body() dto: PhoneRegisterDto) {
    return this.authService.phoneRegister(dto);
  }

  // ─── Phone Register: Verify OTP ─────────────────────────────────────────────
  @Post('phone/verify-registration')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify phone OTP to complete registration' })
  @ApiBody({ type: VerifyPhoneOtpDto })
  @ApiResponse({ status: 200, description: 'Phone verified, tokens returned' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  @ApiResponse({ status: 404, description: 'No registration found' })
  async verifyPhoneOtp(@Body() dto: VerifyPhoneOtpDto) {
    return this.authService.verifyPhoneOtp(dto);
  }

  // ─── Phone Login: Send OTP ───────────────────────────────────────────────────
  @Post('phone/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with phone number (sends WhatsApp OTP)' })
  @ApiBody({ type: PhoneLoginDto })
  @ApiResponse({ status: 200, description: 'OTP sent to WhatsApp' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async phoneLogin(@Body() dto: PhoneLoginDto) {
    return this.authService.phoneLogin(dto);
  }

  // ─── Phone Login: Verify OTP ─────────────────────────────────────────────────
  @Post('phone/verify-login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify phone OTP to complete login' })
  @ApiBody({ type: VerifyPhoneOtpDto })
  @ApiResponse({ status: 200, description: 'Login successful, tokens returned' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async verifyPhoneLoginOtp(@Body() dto: VerifyPhoneOtpDto) {
    return this.authService.verifyPhoneLoginOtp(dto);
  }

  // ─── Phone Forgot Password ───────────────────────────────────────────────────
  @Post('phone/password/forgot')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send forgot password OTP via WhatsApp' })
  @ApiBody({ type: PhoneForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'OTP sent to WhatsApp' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async phoneForgotPassword(@Body() dto: PhoneForgotPasswordDto) {
    return this.authService.phoneForgotPassword(dto);
  }

  // ─── Phone Reset Password ────────────────────────────────────────────────────
  @Patch('phone/password/reset')
  @ApiOperation({ summary: 'Verify OTP and reset password via phone' })
  @ApiBody({ type: PhoneResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  @ApiResponse({ status: 409, description: 'New password cannot be same as old' })
  async phoneResetPassword(@Body() dto: PhoneResetPasswordDto) {
    return this.authService.phoneResetPassword(dto);
  }
}
