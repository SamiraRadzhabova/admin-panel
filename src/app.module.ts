import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppLogger } from './helpers/app.logger';
import { FileHelper } from './helpers/file-system/file-helper';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, AdminsModule],
  controllers: [AppController],
  providers: [AppService, FileHelper, AppLogger],
})
export class AppModule {}
