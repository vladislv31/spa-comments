import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsStringOrNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStringOrNumber',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value === 'number') return true;
          if (typeof value === 'string') {
            const converted = parseInt(value);
            if (!isNaN(converted)) {
              args.object[propertyName] = converted; // Преобразование
              return true;
            }
          }
          return false;
        },
        defaultMessage() {
          return 'Свойство $property должно быть числом или строкой, которую можно преобразовать в число.';
        },
      },
    });
  };
}
