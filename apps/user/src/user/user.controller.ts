import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { QueryUserDto } from './dto/query-user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userSerive: UserService) {}

  @Get()
  async findAll(@Query() query: QueryUserDto) {
    return await this.userSerive.findAll(query);
  }
}
