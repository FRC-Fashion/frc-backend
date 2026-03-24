import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches, MinLength } from 'class-validator';

export class PhoneResetPasswordDto {
  @ApiProperty({ example: '+201018018272', description: 'Phone number in E.164 format' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{6,14}$/, {
    message: 'phoneNumber must be in E.164 format (e.g. +201018018272)',
  })
  phoneNumber: string;

  @ApiProperty({ example: '483921', description: '6-digit OTP code sent via WhatsApp' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp: string;

  @ApiProperty({ example: 'NewStrongPassword@123', description: 'New password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'NewStrongPassword@123', description: 'Confirm new password' })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
