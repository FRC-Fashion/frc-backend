import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Req,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard, JwtRefreshAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyActivationDto } from './dto/verify-activation.dto';
import { ResendActivationDto } from './dto/resend-activation.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyForgotCodeDto } from './dto/verify-forgot-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'User Login Successfully' })
  @ApiResponse({ status: 404, description: 'Not Register Account' })
  @ApiResponse({
    status: 400,
    description: 'Confirm Your Email First / Invalid Login Data',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
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
}
