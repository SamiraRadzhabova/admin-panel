import { Prisma, PrismaClient } from '@prisma/client';

const permissions: Prisma.PermissionCreateManyInput[] = [
  { name: 'White cat', key: 'WHITE_CAT' },
  { name: 'black_cat', key: 'BLACK_CAT' },
  { name: 'brown_cat', key: 'BROWN_CAT' },
  { name: 'orange_cat', key: 'ORANGE_CAT' },
  { name: 'grey_cat', key: 'GREY_CAT' },
];

export const permissionsSeeder = async (prisma: PrismaClient) => {
  try {
    await prisma.permission.createMany({ data: permissions });
    console.log(`${permissions.length} permissions have been seeded`);
  } catch {
    console.log(`Permissions have not been seeded`);
  }
};
