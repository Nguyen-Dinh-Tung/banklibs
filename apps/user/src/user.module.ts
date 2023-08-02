import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CoreModule } from '@app/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CoreModule.forRoot(), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
