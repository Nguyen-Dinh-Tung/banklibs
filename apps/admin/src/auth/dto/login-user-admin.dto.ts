import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserAdminDto {
  @IsNotEmpty()
  @ApiProperty()
  @Length(0, 30)
  @IsString()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  @Length(0, 30)
  @IsString()
  password: string;
}
