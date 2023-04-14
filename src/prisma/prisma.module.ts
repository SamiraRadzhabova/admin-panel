import { Module } from '@nestjs/common';
import { PrismaAdminService } from './prisma-admin.service';

@Module({
  providers: [PrismaAdminService],
  exports: [PrismaAdminService],
})
export class PrismaModule {}
