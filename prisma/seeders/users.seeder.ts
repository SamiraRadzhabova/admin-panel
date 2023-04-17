import { Prisma, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const usersSeeder = async (prisma: PrismaClient) => {
  try {
    const permissions = await prisma.permission.findMany({
      select: { id: true },
    });
    const users: Prisma.UserUncheckedCreateInput[] = [
      {
        first_name: 'Admin',
        password: bcrypt.hashSync('admin', '$2b$14$cKHoaXEStKSkCy4ZmoxOM.'),
        email: 'admin@funduq.ua',
        last_name: 'Smith',
        role: 'ADMIN',
        user_permissions: {
          createMany: {
            data: permissions.map(({ id }) => ({ permission_id: id })),
          },
        },
      },
    ];
    await Promise.all(users.map((user) => prisma.user.create({ data: user })));
    console.log(`${users.length} users have been seeded`);
  } catch {
    console.log(`Users have not been seeded`);
  }
};
