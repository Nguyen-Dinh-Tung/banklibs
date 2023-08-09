import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import * as citiesState from 'country-state-city';

import postal from 'postal-codes-js';
export function ValidatePostCodeCustom(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'PostalCode',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string, arg: ValidationArguments) {
          const countryCode = citiesState.Country.getCountryByCode(
            arg.object['country'],
          );
          if (countryCode)
            return postal.validate(countryCode.isoCode, value) !== true
              ? false
              : true;
          return false;
        },
        defaultMessage() {
          return `${propertyName} is valid`;
        },
      },
    });
  };
}
