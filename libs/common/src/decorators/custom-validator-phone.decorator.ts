import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import * as citiesState from 'country-state-city';
import * as libphonenumber from 'libphonenumber-js';
import { CountryCode } from 'libphonenumber-js';

export function ValidatePhoneCustom(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'PhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string, arg: ValidationArguments) {
          const country = citiesState.Country.getCountryByCode(
            arg.object['country'],
          );
          console.log(country, 'fone');

          const countryCode = country.isoCode as unknown as CountryCode;
          return libphonenumber.isValidPhoneNumber(value, countryCode)
            ? true
            : false;
        },
        defaultMessage() {
          return `${propertyName} is valid`;
        },
      },
    });
  };
}
