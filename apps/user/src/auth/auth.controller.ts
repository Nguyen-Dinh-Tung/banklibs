import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { Public } from '@app/common';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
@ApiBearerAuth()
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  async register(@Body() data: RegisterUserDto) {
    return await this.authService.register(data);
  }

  @Post('login')
  async login(@Body() data: LoginUserDto) {
    return await this.authService.login(data);
  }
}
