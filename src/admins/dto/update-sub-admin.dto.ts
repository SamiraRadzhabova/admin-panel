import { PartialType } from '@nestjs/swagger';
import { CreateSubAdminDto } from './create-sub-admin.dto';

export class UpdateSubAdminDto extends PartialType(CreateSubAdminDto) {}
