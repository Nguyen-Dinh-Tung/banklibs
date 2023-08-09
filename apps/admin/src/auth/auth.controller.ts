import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginUserAdminDto } from './dto/login-user-admin.dto';
import { AuthService } from './auth.service';
import { Public } from '@app/common';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() data: LoginUserAdminDto) {
    return await this.authService.login(data);
  }
}
