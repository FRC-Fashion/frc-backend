import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'user@example.com', format: 'email' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    example: '123456',
    description: '6-digit reset code',
    pattern: '^[0-9]{6}$',
  })
  @IsString()
  @Matches(/^[0-9]{6}$/, { message: 'Reset code must be a 6-digit number' })
  forgetCode: string;

  @ApiProperty({
    example: 'NewPassword123',
    description: 'At least 8 chars, 1 uppercase, 1 lowercase, 1 number',
    pattern: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$',
  })
  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
    message:
      'Password must be at least 8 characters, with 1 uppercase, 1 lowercase, and 1 number',
  })
  password: string;

  @ApiProperty({
    example: 'NewPassword123',
    description: 'Must match password',
  })
  @IsString()
  confirmPassword: string;
}
