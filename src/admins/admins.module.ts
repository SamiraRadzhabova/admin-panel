import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EntityAdminExistsRule } from '../helpers/validation/entity-admin-exists';
import { FileHelper } from 'src/helpers/file-system/file-helper';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AdminsController],
  providers: [AdminsService, EntityAdminExistsRule, FileHelper, AuthModule],
})
export class AdminsModule {}
