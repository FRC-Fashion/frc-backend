import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class VerifyForgotCodeDto {
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
}
