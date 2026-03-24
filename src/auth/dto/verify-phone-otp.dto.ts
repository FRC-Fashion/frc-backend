import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class VerifyPhoneOtpDto {
  @ApiProperty({ example: '+201018018272', description: 'Phone number in E.164 format' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{6,14}$/, {
    message: 'phoneNumber must be in E.164 format (e.g. +201018018272)',
  })
  phoneNumber: string;

  @ApiProperty({ example: '483921', description: '6-digit OTP code' })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp: string;
}
