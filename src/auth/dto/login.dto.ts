import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  @IsDefined({ message: 'Email is required' })
  @IsEmail({}, { message: 'Incorrect email address' })
  @ApiProperty({ example: 'adam@gmail.com' })
  email: string;
  @IsDefined({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @ApiProperty({ example: 'MySr0ngP@ssw0rd' })
  password: string;
}
