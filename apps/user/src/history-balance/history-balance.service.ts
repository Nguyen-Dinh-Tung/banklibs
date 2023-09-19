import { HistoryBalanceEntity } from '@app/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHistoryBalance } from './dto/create-history-balance.dto';

@Injectable()
export class HistoryBalanceService {
  constructor(
    @InjectRepository(HistoryBalanceEntity)
    private readonly historyBalanceRepo: Repository<HistoryBalanceEntity>,
  ) {}

  async createHistoryBalance(
    data: CreateHistoryBalance,
  ): Promise<HistoryBalanceEntity> {
    return await this.historyBalanceRepo.save(
      this.historyBalanceRepo.create({
        ...data,
        createdAt: new Date().toISOString(),
      }),
    );
  }
}
