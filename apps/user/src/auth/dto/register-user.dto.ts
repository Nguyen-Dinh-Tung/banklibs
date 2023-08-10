import { ValidateCityCustom, ValidatePhoneCustom } from '@app/common';
import { CountryCode } from '@app/common/enum/database.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsUrl,
  Length,
  Max,
  Min,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 30)
  fullname: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidatePhoneCustom()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  idJob: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(12)
  @IsString()
  identifierNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @Min(1)
  @Max(120)
  @IsInt()
  age: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  avatar: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  backCard: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  frontCard: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 30)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(6, 30)
  password: string;

  @ApiProperty({ enum: CountryCode })
  @IsNotEmpty()
  @IsEnum(CountryCode)
  country: CountryCode;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateCityCustom()
  city: string;
}
