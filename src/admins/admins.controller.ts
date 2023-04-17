import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SuccessResponseDocs } from '../helpers/docs/successShema';
import { AdminsService } from './admins.service';
import { CreateSubAdminDto } from './dto/create-sub-admin.dto';
import { SubAdminIdDto } from './dto/sub-admin-id.dto.';
import { UpdateSubAdminDto } from './dto/update-sub-admin.dto';
import {
  SubAdminEntity,
  SubAdminSearchEntity,
} from './entities/sub-admin.entity';
import { Role } from '@prisma/client';
import { FullPermissionEntity } from 'src/helpers/entities/permission.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IRequest } from 'src/auth/interfaces/request.interface';

// #region Swagger Decorators
@ApiTags('Admins')
@ApiUnprocessableEntityResponse()
@ApiForbiddenResponse()
@ApiBearerAuth()
// #endregion
@UseGuards(RolesGuard)
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

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
  getPermissions(): Promise<FullPermissionEntity[]> {
    return this.adminsService.getPermissions();
  }

  // #region Swagger Decorators
  @ApiOperation({ summary: 'Get sub-admins' })
  @ApiOkResponse({
    type: SubAdminSearchEntity,
    isArray: true,
  })
  // #endregion
  @Roles(Role.ADMIN)
  @Get()
  getSubAdmins(): Promise<SubAdminSearchEntity[]> {
    return this.adminsService.getSubAdmins();
  }

  // #region Swagger Decorators
  @ApiOperation({ summary: 'Get sub-admin' })
  @ApiOkResponse({ type: SubAdminEntity })
  // #endregion
  @Roles(Role.ADMIN)
  @Get(':sub_admin_id')
  getSubAdmin(
    @Param() { sub_admin_id }: SubAdminIdDto,
  ): Promise<SubAdminEntity> {
    return this.adminsService.getSubAdmin(sub_admin_id);
  }

  // #region Swagger Decorators
  @ApiOperation({ summary: 'Create sub-admins' })
  @ApiCreatedResponse(SuccessResponseDocs)
  @ApiBody({ type: CreateSubAdminDto })
  // #endregion
  @Roles(Role.ADMIN)
  @Post()
  createSubAdmin(@Body() createSubAdminDto: CreateSubAdminDto) {
    return this.adminsService.createSubAdmin(createSubAdminDto);
  }

  // #region Swagger Decorators
  @ApiOperation({ summary: 'Update sub-admins' })
  @ApiCreatedResponse(SuccessResponseDocs)
  @ApiBody({ type: UpdateSubAdminDto })
  // #endregion
  @Roles(Role.ADMIN)
  @Patch(':sub_admin_id')
  updateSubAdmin(
    @Param() { sub_admin_id }: SubAdminIdDto,
    @Body() updateSubAdminDto: UpdateSubAdminDto,
  ) {
    return this.adminsService.updateSubAdmin(sub_admin_id, updateSubAdminDto);
  }

  // #region Swagger Decorators
  @ApiOperation({ summary: 'Delete sub-admin' })
  @ApiOkResponse(SuccessResponseDocs)
  // #endregion
  @Roles(Role.ADMIN)
  @Delete(':sub_admin_id')
  deleteSubAdmin(@Param() { sub_admin_id }: SubAdminIdDto) {
    return this.adminsService.deleteSubAdmin(sub_admin_id);
  }
}
