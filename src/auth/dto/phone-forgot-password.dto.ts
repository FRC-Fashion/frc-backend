import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class PhoneForgotPasswordDto {
  @ApiProperty({ example: '+201018018272', description: 'Phone number in E.164 format' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{6,14}$/, {
    message: 'phoneNumber must be in E.164 format (e.g. +201018018272)',
  })
  phoneNumber: string;
}
