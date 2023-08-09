import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import * as citiesState from 'country-state-city';
import _ from 'lodash';
export function ValidateCityCustom(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'City',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: string, arg: ValidationArguments) {
          const countryCode = arg.object['country'];
          if (countryCode) {
            const cities = citiesState.State.getStatesOfCountry(countryCode);
            const groupCitiesByName = _.groupBy(cities, 'name');
            return groupCitiesByName[value] ? true : false;
          }
          return false;
        },
        defaultMessage() {
          return `${propertyName} is valid`;
        },
      },
    });
  };
}
