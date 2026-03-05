import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Ahmed Ali',
    description: 'Full name of the user (2 to 50 characters)',
    minLength: 5,
    maxLength: 50,
  })
  @IsString()
  @MinLength(5, { message: 'Full name must be at least 5 characters' })
  @MaxLength(50, { message: 'Full name must not exceed 50 characters' })
  fullName: string;

  @ApiProperty({ example: 'user@example.com', format: 'email' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    example: 'Password123',
    description: 'At least 8 chars, 1 uppercase, 1 lowercase, 1 number',
    pattern: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$',
  })
  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message:
      'Password must be at least 8 characters, with 1 uppercase, 1 lowercase, and 1 number',
  })
  password: string;
}
