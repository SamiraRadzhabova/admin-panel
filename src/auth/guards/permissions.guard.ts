import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { PermissionKey } from '@prisma/client';

@Injectable()
export class PermissionsGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info, context) {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionKey[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
    if (!requiredPermissions) {
      return true;
    }
    if (user) {
      if (user.permissions.length === 0) {
        throw new ForbiddenException({
          message: 'Your account are stopped, write to administrator',
          logout: true,
        });
      }
      if (
        requiredPermissions.some((permission) =>
          user.permissions.includes(permission),
        )
      ) {
        return user;
      } else {
        throw new ForbiddenException(`This admin has't required permissions`);
      }
    }
    throw new UnauthorizedException('Invalid token');
  }
}
