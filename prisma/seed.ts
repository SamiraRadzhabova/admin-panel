import { ConfigService } from '@nestjs/config';
import { FileHelper } from '../src/helpers/file-system/file-helper';
import { usersSeeder } from './seeders/users.seeder';
import { PrismaClient as PrismaAdminFunduq } from './generated/funduq-admin';
import { permissionsSeeder } from './seeders/permissions.seeder';

const prismaAdmin = new PrismaAdminFunduq();
const config = new ConfigService({ STORAGE: 'storage' });
const fileHelper = new FileHelper(config);
prismaAdmin.$use(async (params, next) => {
  const result = await next(params);
  fileHelper.log('db', params);
  return result;
});

async function runAllSeeders() {
  await permissionsSeeder(prismaAdmin);
  await usersSeeder(prismaAdmin);
}

async function main() {
  const seederName = process.env.npm_config_seeder;
  if (!seederName) return await runAllSeeders();
  switch (seederName) {
    case 'users':
      await usersSeeder(prismaAdmin);
      break;
    case 'permission':
      await permissionsSeeder(prismaAdmin);
      break;
    default:
      throw new Error('Seeder not found');
  }
}
main()
  .then(async () => {
    await prismaAdmin.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaAdmin.$disconnect();
    process.exit(1);
  });
