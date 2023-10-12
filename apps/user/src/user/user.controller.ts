import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryUserDto } from './dto/query-user.dto';
import { UserService } from './user.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { User, UserEntity } from '@app/common';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userSerive: UserService) {}

  @Get()
  async findAll(@Query() query: QueryUserDto) {
    return await this.userSerive.findAll(query);
  }

  @Post('verify-email')
  async verifyEmail(@Body() data: VerifyEmailDto, @User() user: UserEntity) {
    return await this.userSerive.verifyEmail(data, user);
  }

  @Get('me')
  async getMe(@User() user: UserEntity) {
    return await this.userSerive.getMe(user);
  }
}
