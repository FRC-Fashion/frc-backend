import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class PhoneRegisterDto {
  @ApiProperty({ example: 'Ahmed Aly', description: 'Full name' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  /**
   * Phone in E.164 format: +[country code][number]
   * e.g.  +201018018272  or  +14155552671
   */
  @ApiProperty({ example: '+201018018272', description: 'Phone number in E.164 format' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{6,14}$/, {
    message: 'phoneNumber must be in E.164 format (e.g. +201018018272)',
  })
  phoneNumber: string;

  @ApiProperty({ example: 'Password123!', description: 'User password' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;
}
