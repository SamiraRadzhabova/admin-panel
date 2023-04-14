import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsNumber } from 'class-validator';
import { EntityAdminExists } from '../../helpers/validation/entity-admin-exists';

export class SubAdminIdDto {
  @IsDefined()
  @Type(() => Number)
  @IsNumber()
  @EntityAdminExists('user')
  @ApiProperty({ example: 1 })
  sub_admin_id: number;
}
