import { UserBalanceEntity } from './user-balance.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IdDateEntity, NotNullColum } from '../database';

Entity('history_balance');
export class HistoryBalanceEntity extends IdDateEntity {
  @ManyToOne(() => UserBalanceEntity, (balance) => balance.id)
  @JoinColumn({ name: 'user_balance' })
  userBalance: UserBalanceEntity;

  @NotNullColum({ name: 'previous_balance' })
  previousBalance: bigint;

  @NotNullColum({ name: 'end_balance' })
  endBalance: bigint;

  @NotNullColum({ name: 'type_transaction' })
  typeTransaction: string;
}
