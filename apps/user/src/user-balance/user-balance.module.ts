import { Module } from '@nestjs/common';
import { UserBalanceController } from './user-balance.controller';
import { UserBalanceService } from './user-balance.service';

@Module({
  controllers: [UserBalanceController],
  providers: [UserBalanceService],
  exports: [UserBalanceService],
})
export class UserBalanceModule {}
