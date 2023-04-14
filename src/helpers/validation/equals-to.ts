import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'EqualsTo' })
@Injectable()
export class EqualsToRule implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const field = args.constraints[0] as string;
    return value === args.object[field];
  }
  defaultMessage() {
    return `The fields are not the same.`;
  }
}
/**
 * Validates if the field is empty if the condition is true.
 */
export const EqualsTo = (field: string, options?: ValidationOptions) => {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'EqualsTo',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [field],
      options,
      validator: EqualsToRule,
    });
  };
};
