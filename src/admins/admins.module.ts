import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { EntityAdminExistsRule } from '../helpers/validation/entity-admin-exists';

@Module({
  imports: [PrismaModule],
  controllers: [AdminsController],
  providers: [AdminsService, EntityAdminExistsRule],
})
export class AdminsModule {}
