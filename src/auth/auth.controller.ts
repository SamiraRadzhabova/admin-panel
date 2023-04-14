import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import {
  ForbiddenResponse,
  UnauthorizedResponse,
  UnprocessableEntityResponse,
} from '../helpers/docs/errorSchema';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { LoginEntity } from './entities/login.entity';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { IRequest } from './interfaces/request.interface';
import { FullPermissionEntity } from '../helpers/entities/permission.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // #region Swagger Decorators
  @ApiOperation({ summary: 'Login' })
  @ApiUnprocessableEntityResponse(
    UnprocessableEntityResponse('password', 'Password is required'),
  )
  @ApiForbiddenResponse(ForbiddenResponse('Incorrect credentials'))
  @ApiCreatedResponse({ type: LoginEntity })
  @ApiBody({ type: LoginDto })
  @HttpCode(200)
  // #endregion
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() { user }: IRequest) {
    return this.authService.login(user.id);
  }

  // #region Swagger Decorators
  @ApiOperation({ summary: 'Refresh token' })
  @ApiCreatedResponse({ type: LoginEntity })
  @ApiUnauthorizedResponse(UnauthorizedResponse)
  @ApiUnprocessableEntityResponse(
    UnprocessableEntityResponse('token', 'Token is required'),
  )
  @ApiBody({ type: RefreshDto })
  @HttpCode(200)
  // #endregion
  @Post('refresh')
  refresh(@Body() refreshDto: RefreshDto): Promise<LoginEntity> {
    return this.authService.validateRefreshToken(refreshDto.token);
  }

  // #region Swagger Decorators
  @ApiOperation({ summary: 'Get permissions for admin' })
  @ApiOkResponse({
    type: FullPermissionEntity,
    isArray: true,
  })
  @ApiBearerAuth()
  // #endregion
  @UseGuards(JwtAuthGuard)
  @Get('permissions')
  getPermissions(@Req() { user }: IRequest): Promise<FullPermissionEntity[]> {
    return this.authService.getPermissions(user.id);
  }
}
