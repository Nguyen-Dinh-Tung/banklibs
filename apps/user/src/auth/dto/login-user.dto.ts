import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @ApiProperty()
  @Length(6, 30)
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  @Length(6, 30)
  password: string;
}
