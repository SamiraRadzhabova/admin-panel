import { Prisma, PrismaClient } from '@prisma/client';

const permissions: Prisma.PermissionCreateManyInput[] = [
  { name: 'White cat', key: 'WHITE_CAT' },
  { name: 'Black cat', key: 'BLACK_CAT' },
  { name: 'Brown cat', key: 'BROWN_CAT' },
  { name: 'Orange cat', key: 'ORANGE_CAT' },
  { name: 'Grey cat', key: 'GREY_CAT' },
];

export const permissionsSeeder = async (prisma: PrismaClient) => {
  try {
    await prisma.permission.createMany({ data: permissions });
    console.log(`${permissions.length} permissions have been seeded`);
  } catch {
    console.log(`Permissions have not been seeded`);
  }
};
