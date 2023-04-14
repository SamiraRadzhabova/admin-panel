import { Prisma, PrismaClient } from '../generated/funduq-admin';

const permissions: Prisma.PermissionCreateManyInput[] = [
  { name: 'Read user`s information', key: 'USER_INFO' },
  { name: 'Ban users', key: 'USER_BAN' },
  { name: 'Read dashboard information', key: 'DASHBOARD' },
  { name: 'CRUD content', key: 'CONTENT' },
  { name: 'CRUD slider', key: 'SLIDER' },
];

export const permissionsSeeder = async (prisma: PrismaClient) => {
  try {
    await prisma.permission.createMany({ data: permissions });
    console.log(`${permissions.length} permissions have been seeded`);
  } catch {
    console.log(`Permissions have not been seeded`);
  }
};
