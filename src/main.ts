import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './helpers/all-exceptions.filter';
import { AppLogger } from './helpers/app.logger';
import { FileHelper } from './helpers/file-system/file-helper';
import { PrismaAdminService } from './prisma/prisma-admin.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'static'));
  app.enableCors({ origin: '*' });
  const prismaAdminService = app.get(PrismaAdminService);
  const fileHelper = app.get(FileHelper);
  prismaAdminService.$use(async (params, next) => {
    const result = await next(params);
    if (params?.model === 'User' && params?.args?.select?.password !== true) {
      if (Array.isArray(result)) {
        result.map((user) => {
          delete user?.password;
          return user;
        });
      } else {
        delete result?.password;
      }
    }
    fileHelper.log('db', params);
    return result;
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      stopAtFirstError: true,
      // errorHttpStatusCode: 422,
      exceptionFactory: (errors) =>
        new UnprocessableEntityException({ errors }),
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalFilters(
    new AllExceptionsFilter(app.get(HttpAdapterHost), app.get(AppLogger)),
  );
  //Swagger
  const config = new DocumentBuilder()
    .setTitle('Funduq-admin')
    .setDescription('The funduq-admin API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
