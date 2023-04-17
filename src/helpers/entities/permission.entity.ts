import { ApiProperty } from '@nestjs/swagger';

export class PermissionEntity {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'Read user`s information' })
  name: string;
}

export class FullPermissionEntity extends PermissionEntity {
  @ApiProperty({ example: '/..//././' })
  path: string;
}
