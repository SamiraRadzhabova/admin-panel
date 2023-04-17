import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaAdminService } from '../prisma/prisma-admin.service';
import * as bcrypt from 'bcrypt';
import { IPayload } from './interfaces/payload.interface';
import { ConfigService } from '@nestjs/config';
import * as moment from 'moment';
import { JwtService } from '@nestjs/jwt';
import { FileHelper } from 'src/helpers/file-system/file-helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaAdmin: PrismaAdminService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly fileHelper: FileHelper,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prismaAdmin.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, role: true },
    });
    if (user && bcrypt.compareSync(password, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateRefreshToken(token: string) {
    let payload: IPayload;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
      });
    } catch {
      throw new UnprocessableEntityException('Uncorrected token');
    }
    const refresh_token = await this.prismaAdmin.userRefreshToken.findUnique({
      where: { id: payload.jti },
      select: { id: true, user_id: true, expires_at: true },
    });
    if (!refresh_token || refresh_token.user_id !== payload.sub) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (refresh_token.expires_at.valueOf() < Date.now().valueOf()) {
      await this.prismaAdmin.userRefreshToken.delete({
        where: { id: payload.jti },
      });
      throw new UnauthorizedException('Refresh token is expired');
    }
    return this.getNewTokens(payload.sub, payload.jti);
  }

  async validateAccessToken(payload: IPayload) {
    const { access_token, user_id, user } =
      await this.prismaAdmin.userRefreshToken.findUniqueOrThrow({
        where: { id: payload.jti },
        select: {
          user_id: true,
          access_token: {
            select: { id: true, expires_at: true },
          },
          user: {
            select: {
              role: true,
              user_permissions: {
                select: { permission: { select: { key: true } } },
              },
            },
          },
        },
      });
    if (access_token.expires_at.valueOf() < Date.now().valueOf()) {
      throw new UnauthorizedException('Access token is expired');
    }
    if (user_id !== payload.sub) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return {
      id: payload.sub,
      refresh_id: payload.jti,
      role: user?.role,
      permissions: user?.user_permissions.map(
        (user_permission) => user_permission.permission.key,
      ),
    };
  }

  async login(user_id: number) {
    const { user_permissions, ...user } =
      await this.prismaAdmin.user.findFirstOrThrow({
        where: { id: user_id },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          position: true,
          role: true,
          user_permissions: {
            select: { permission: { select: { key: true } } },
          },
        },
      });
    const permissions = user_permissions.map(
      ({ permission }) => permission.key,
    );
    if (permissions.length === 0) {
      throw new ForbiddenException({
        message: 'Your account are stopped, write to administrator',
        logout: true,
      });
    }
    const tokens = await this.getNewTokens(user_id);
    return {
      user: {
        ...user,
        permissions,
      },
      ...tokens,
    };
  }

  async getNewTokens(user_id: number, refresh_id?: number) {
    const promiseArray = [];
    const refresh_expires_in = +this.configService.get<string>(
      'JWT_REFRESH_EXPIRATION_TIME',
    );
    const access_expires_in = +this.configService.get<string>(
      'JWT_EXPIRATION_TIME',
    );
    promiseArray.push(
      this.prismaAdmin.userRefreshToken.create({
        data: {
          user_id,
          expires_at: moment().add(refresh_expires_in, 'ms').toDate(),
          access_token: {
            create: {
              expires_at: moment().add(access_expires_in, 'ms').toDate(),
            },
          },
        },
        select: { id: true },
      }),
    );
    if (refresh_id) {
      promiseArray.push(
        this.prismaAdmin.userRefreshToken.delete({
          where: { id: refresh_id },
        }),
      );
    }
    const [refresh] = await this.prismaAdmin.$transaction(promiseArray);
    const payload: IPayload = {
      sub: user_id,
      jti: refresh.id,
    };
    const refresh_token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<number>('JWT_REFRESH_EXPIRATION_TIME'),
      secret: this.configService.get('JWT_REFRESH_SECRET_KEY'),
    });
    const access_token = this.jwtService.sign(payload);
    const { user_permissions, ...user } =
      await this.prismaAdmin.user.findUnique({
        where: { id: user_id },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          position: true,
          role: true,
          user_permissions: {
            select: { permission: { select: { key: true } } },
          },
        },
      });
    return {
      access_token,
      refresh_token,
      user: {
        ...user,
        permissions: user_permissions.map(
          (user_permission) => user_permission.permission.key,
        ),
      },
    };
  }

  hashPassword(password: string): string {
    return bcrypt.hashSync(password, this.configService.get('JWT_SALT'));
  }

  async getPermissions(user_id: number) {
    const permissions = await this.prismaAdmin.permission.findMany({
      where: { user_permissions: { some: { user_id } } },
      select: { id: true, key: true, name: true },
    });
    return permissions.map(({ id, key, name }) => ({
      id,
      name,
      path: this.fileHelper.getFullPath(`cats/${key}`) + '.jpg',
    }));
  }
}
