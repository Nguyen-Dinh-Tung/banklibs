import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { Public, User, UserEntity } from '@app/common';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgotPasswordDto, GetPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
@ApiBearerAuth()
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiConsumes('multipart/form-data')
  @Public()
  async register(@Body() data: RegisterUserDto) {
    return await this.authService.register(data);
  }

  @Post('login')
  @ApiConsumes('multipart/form-data')
  @Public()
  async login(@Body() data: LoginUserDto) {
    return await this.authService.login(data);
  }

  @Get('me')
  async getMe(@User() user: UserEntity) {
    return await this.authService.getMe(user);
  }

  @Get('forgot-password')
  @Public()
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    return await this.authService.forgotPassword(data);
  }

  @Post('forgot-password')
  @Public()
  async getPassword(@Body() data: GetPasswordDto) {
    return await this.authService.getPassword(data);
  }
}
