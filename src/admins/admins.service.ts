import { Injectable } from '@nestjs/common';
import { PrismaAdminService } from 'src/prisma/prisma-admin.service';

import { CreateSubAdminDto } from './dto/create-sub-admin.dto';
import { UpdateSubAdminDto } from './dto/update-sub-admin.dto';
import { Prisma } from '@prisma/client';
import { FileHelper } from 'src/helpers/file-system/file-helper';
import { SnakeCaseToLocalText } from 'src/helpers/const-to-text';

@Injectable()
export class AdminsService {
  constructor(
    private readonly prismaAdmin: PrismaAdminService,
    private readonly fileHelper: FileHelper,
  ) {}

  async getPermissions() {
    const permissions = await this.prismaAdmin.permission.findMany({
      select: { id: true, key: true, name: true },
    });
    return permissions.map(({ id, key, name }) => ({
      id,
      name: SnakeCaseToLocalText(name),
      path: this.fileHelper.getFullPath(`cats/${key}`) + '.jpg',
    }));
  }

  async createSubAdmin({ permission_ids, ...dto }: CreateSubAdminDto) {
    const data: Prisma.UserCreateInput = {
      ...dto,
      user_permissions: {
        createMany: {
          data: permission_ids.map((permission_id) => ({
            permission_id,
          })),
        },
      },
    };
    await this.prismaAdmin.user.create({
      data,
      select: { email: true },
    });
    return { status: 'success' };
  }

  async updateSubAdmin(
    subAdminId: number,
    { permission_ids, ...dto }: UpdateSubAdminDto,
  ) {
    const data: Prisma.UserUpdateInput = {
      ...dto,
      password: dto?.email ? null : undefined,
      user_permissions: permission_ids
        ? {
            createMany: {
              data: permission_ids.map((permission_id) => ({
                permission_id,
              })),
            },
          }
        : undefined,
    };
    await this.prismaAdmin.$transaction([
      this.prismaAdmin.userPermission.deleteMany({
        where: { user_id: subAdminId },
      }),
      this.prismaAdmin.user.update({
        where: { id: subAdminId },
        data,
        select: { id: true },
      }),
    ]);
    return { status: 'success' };
  }

  async getSubAdmins() {
    const subAdmins = await this.prismaAdmin.user.findMany({
      where: { role: 'SUB_ADMIN' },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    });
    return subAdmins;
  }

  async getSubAdmin(subAdminId: number) {
    const { user_permissions, ...subAdmin } =
      await this.prismaAdmin.user.findUnique({
        where: { id: subAdminId },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          user_permissions: {
            select: { permission: { select: { id: true, name: true } } },
          },
        },
      });
    const result = {
      ...subAdmin,
      permissions: user_permissions.map(
        (user_permission) => user_permission.permission,
      ),
    };
    return result;
  }

  async deleteSubAdmin(subAdminId: number) {
    await this.prismaAdmin.user.delete({ where: { id: subAdminId } });
    return { status: 'success' };
  }
}
