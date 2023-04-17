import { ApiProperty } from '@nestjs/swagger';
import { PermissionKey, Role } from '@prisma/client';

class UserLoginEntity {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'Adam' })
  first_name: string;
  @ApiProperty({ example: 'Smith' })
  last_name: string;
  @ApiProperty({ example: 'adam@gmail.com' })
  email: string;
  @ApiProperty({ example: 'Admin' })
  position: string;
  @ApiProperty({ example: Role.SUB_ADMIN, enum: Role })
  role: Role;
  @ApiProperty({
    example: [PermissionKey.BLACK_CAT, PermissionKey.WHITE_CAT],
    enum: PermissionKey,
    isArray: true,
  })
  permissions: PermissionKey[];
}

export class LoginEntity {
  @ApiProperty({ type: UserLoginEntity })
  user: UserLoginEntity;
  @ApiProperty({ example: 'ASdojahiufjhiajwmpqf0idj214877^%ASDya' })
  access_token: string;
  @ApiProperty({ example: 'ASdojahiufjhiajwmpqf0idj214877^%ASDya' })
  refresh_token: string;
}
