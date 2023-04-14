import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { LoginDto } from '../dto/login.dto';
import { validateSync } from 'class-validator';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err, user, info, context) {
    const request = context.switchToHttp().getRequest();
    if (typeof request.body !== 'object') request.body = {};
    const loginDto = plainToInstance(LoginDto, request.body);
    if (err || !user) {
      const validationErrors = validateSync(loginDto);
      if (validationErrors.length !== 0) {
        throw new UnprocessableEntityException({
          errors: validationErrors,
        });
      } else {
        throw new UnauthorizedException('Incorrect email or password');
      }
    }
    return user;
  }
}
