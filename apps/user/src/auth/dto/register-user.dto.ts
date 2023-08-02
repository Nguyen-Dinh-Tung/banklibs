import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsPhoneNumber,
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
  @IsPhoneNumber('VN')
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
}
