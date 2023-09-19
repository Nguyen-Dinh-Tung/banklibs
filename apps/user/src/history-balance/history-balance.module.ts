import { Module } from '@nestjs/common';
import { HistoryBalanceService } from './history-balance.service';

@Module({
  providers: [HistoryBalanceService],
})
export class HistoryBalanceModule {}
