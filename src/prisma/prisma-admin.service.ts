import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { FileHelper } from '../helpers/file-system/file-helper';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaAdminService extends PrismaClient implements OnModuleInit {
  private fileHelper: FileHelper;

  constructor() {
    super({ log: ['query'] });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
