import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsEmail, IsString, Length } from 'class-validator';
import { EqualsTo } from '../../helpers/validation/equals-to';

export class RecoverPasswordDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  @IsDefined({ message: 'Email is required.' })
  @IsString({ message: 'Email must be a string.' })
  @Length(7, 150, {
    message: 'Email must be between 7 and 150 characters long.',
  })
  @IsEmail()
  @ApiProperty({ example: 'email@gmail.com' })
  email: string;
  @IsDefined({ message: 'Password is required.' })
  @IsString({ message: 'Password must be a string.' })
  @Length(8, 32, {
    message: 'Password must be between 8 and 32 characters long.',
  })
  @ApiProperty({ example: '12345678P@wd' })
  password: string;
  @IsDefined({ message: 'Password confirmation is required.' })
  @IsString({ message: 'Password confirmation must be a string.' })
  @EqualsTo('password', { message: 'The passwords are not the same.' })
  @ApiProperty({ example: '12345678P@wd' })
  password_confirmation: string;
  @IsDefined({ message: 'Token is required.' })
  @IsString({ message: 'Token must be a string.' })
  @ApiProperty({ example: '6758754a64364d7655af432432' })
  token: string;
}
