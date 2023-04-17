import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EntityAdminExistsRule } from '../helpers/validation/entity-admin-exists';
import { FileHelper } from 'src/helpers/file-system/file-helper';

@Module({
  imports: [PrismaModule],
  controllers: [AdminsController],
  providers: [AdminsService, EntityAdminExistsRule, FileHelper],
})
export class AdminsModule {}
