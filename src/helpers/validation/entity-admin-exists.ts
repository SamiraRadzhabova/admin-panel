import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaAdminService } from '../../prisma/prisma-admin.service';

@ValidatorConstraint({ name: 'EntityAdminExists', async: true })
@Injectable()
export class EntityAdminExistsRule implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaAdminService) {}

  async validate(value: any, args: ValidationArguments) {
    const [entity, column, shouldExist] = args.constraints;
    const where: {
      [field: string]: any;
    } = {};
    if (!value) return true;
    if (Array.isArray(value)) {
      if (!value.every((element) => Number.isInteger(+element))) return false;
      where.id = { in: value };
    } else {
      if (column === 'id' && typeof value !== 'number') return false;
      where[column] = value;
    }
    try {
      const result = await this.prisma[entity].findMany({
        select: { id: true },
        where,
      });
      if (shouldExist) {
        if (Array.isArray(value)) {
          return result.length === [...new Set(value)].length;
        }
        return !!result.length;
      } else {
        if (Array.isArray(value)) {
          return result.length === 0;
        }
        return !result.length;
      }
    } catch (error) {
      throw error;
    }
  }
  defaultMessage(args: ValidationArguments) {
    if (args.constraints[2]) {
      return `This ${args.property} does not exists!`;
    }
    return `This ${args.property} already exists!`;
  }
}

type PrismaEntity = Exclude<
  keyof PrismaAdminService,
  `$${string}` | 'onModuleInit' | 'enableShutdownHooks'
>;
type PrismaEntityKey<T extends PrismaEntity> = Exclude<
  keyof Parameters<PrismaAdminService[T]['create']>[0]['select'],
  '_count'
>;

type EntityAdminExistsOverload = {
  (entity: PrismaEntity): PropertyDecorator;
  (
    entity: PrismaEntity,
    validationOptions: ValidationOptions,
  ): PropertyDecorator;
  <TEntity extends PrismaEntity>(
    entity: TEntity,
    column: PrismaEntityKey<TEntity>,
  ): PropertyDecorator;
  <TEntity extends PrismaEntity>(
    entity: TEntity,
    column: PrismaEntityKey<TEntity>,
    validationOptions: ValidationOptions,
  ): PropertyDecorator;
  <TEntity extends PrismaEntity>(
    entity: TEntity,
    column: PrismaEntityKey<TEntity>,
    shouldExist: boolean,
  ): PropertyDecorator;
  <TEntity extends PrismaEntity>(
    entity: TEntity,
    column: PrismaEntityKey<TEntity>,
    shouldExist: boolean,
    validationOptions: ValidationOptions,
  ): PropertyDecorator;
};
export const EntityAdminExists: EntityAdminExistsOverload = (
  entity: PrismaEntity,
  second?: string | ValidationOptions,
  third?: boolean | ValidationOptions,
  forth?: ValidationOptions,
) => {
  const column = typeof second === 'string' ? second : 'id';
  const shouldExist = typeof third === 'boolean' ? third : true;
  const validationOptions =
    typeof second !== 'string'
      ? second
      : typeof third !== 'boolean'
      ? third
      : forth;
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'EntityAdminExists',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [entity, column, shouldExist],
      options: validationOptions,
      validator: EntityAdminExistsRule,
    });
  };
};
