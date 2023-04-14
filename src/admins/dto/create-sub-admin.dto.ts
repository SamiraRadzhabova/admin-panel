import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsEmail,
  IsString,
  Length,
} from 'class-validator';
import { EntityAdminExists } from '../../helpers/validation/entity-admin-exists';

export class CreateSubAdminDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  @IsDefined({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @Length(7, 100, {
    message: 'Email must be between 7 and 150 characters long.',
  })
  @EntityAdminExists('user', 'email', false)
  @ApiProperty({ example: 'adam@gmail.com' })
  email: string;
  @IsDefined({ message: 'First name is required.' })
  @IsString({ message: 'First name must be a string.' })
  @Length(2, 50, {
    message: 'First name must be between 2 and 50 characters long.',
  })
  @ApiProperty({ example: 'Adam' })
  first_name: string;
  @IsDefined({ message: 'Last name is required.' })
  @IsString({ message: 'Last name must be a string.' })
  @Length(2, 50, {
    message: 'Last name must be between 2 and 50 characters long.',
  })
  @ApiProperty({ example: 'Smith' })
  last_name: string;
  @IsDefined({ message: 'Post is required.' })
  @IsString({ message: 'Post must be a string.' })
  @Length(2, 50, {
    message: 'Post must be between 2 and 50 characters long.',
  })
  @ApiProperty({ example: 'HR manager' })
  position: string;
  @IsDefined({ message: 'Password is required.' })
  @Length(8, 32, {
    message: 'Password must be between 8 and 32 characters long.',
  })
  @IsString({ message: 'Password must be a string.' })
  @ApiProperty({ example: 'MySr0ngP@ssw0rd' })
  password: string;
  @IsDefined()
  @IsArray()
  @ArrayMinSize(1)
  @EntityAdminExists('permission')
  permission_ids: number[];
}
