import { Module } from '@nestjs/common';
import { FeeController } from './fee.controller';
import { FeeService } from './fee.service';
import { AdminLogModule } from '../admin-log/admin-log.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  HistoryOwnFeeSettingEntity,
  HistorySystemFeeSettingEntity,
} from '@app/common';
import { UserModule } from '../user/user.module';
@Module({
  imports: [
    AdminLogModule,
    TypeOrmModule.forFeature([
      HistoryOwnFeeSettingEntity,
      HistorySystemFeeSettingEntity,
    ]),
    UserModule,
  ],
  controllers: [FeeController],
  providers: [FeeService],
})
export class FeeModule {}
