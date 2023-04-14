import { ApiProperty, OmitType } from '@nestjs/swagger';
import { PermissionEntity } from '../../helpers/entities/permission.entity';

export class SubAdminEntity {
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
  @ApiProperty({
    isArray: true,
    type: PermissionEntity,
  })
  permissions: PermissionEntity[];
}

export class SubAdminSearchEntity extends OmitType(SubAdminEntity, [
  'permissions',
] as const) {}
