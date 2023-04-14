import { PermissionKey, Role } from '@prisma/client';

export interface IRequest {
  user: IRequestUser;
}
export interface IRequestUser {
  id: number;
  refresh_id: number;
  role: Role;
  permissions: PermissionKey[];
}
