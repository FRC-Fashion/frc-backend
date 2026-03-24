import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com or +201018018272',
    description: 'Email address OR phone number in E.164 format',
  })
  @IsString()
  @IsNotEmpty({ message: 'identifier is required' })
  @Matches(/^(\+[1-9]\d{6,14}|[^\s@]+@[^\s@]+\.[^\s@]+)$/, {
    message: 'identifier must be a valid email or phone number in E.164 format (e.g. +201018018272)',
  })
  identifier: string;

  @ApiProperty({ example: 'Password123' })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
