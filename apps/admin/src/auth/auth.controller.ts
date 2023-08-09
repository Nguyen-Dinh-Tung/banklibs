import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginUserAdminDto } from './dto/login-user-admin.dto';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  @Post('login')
  async login(@Body() data: LoginUserAdminDto) {}
}
