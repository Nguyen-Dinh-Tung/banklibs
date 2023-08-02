import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CoreModule } from '@app/common';

@Module({
  imports: [CoreModule.forRoot()],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
