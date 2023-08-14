import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserAdminModule } from '../user-admin/user-admin.module';

@Module({
  imports: [UserAdminModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
