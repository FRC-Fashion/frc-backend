import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class VerifyActivationDto {
  @ApiProperty({ example: 'user@example.com', format: 'email' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    example: '1234',
    description: '4-digit activation code',
    pattern: '^[0-9]{4}$',
  })
  @IsString()
  @Matches(/^[0-9]{4}$/, {
    message: 'Activation code must be a 4-digit number',
  })
  activationCode: string;
}
