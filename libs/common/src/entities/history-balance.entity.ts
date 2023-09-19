import { UserBalanceEntity } from './user-balance.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IdDateEntity, NotNullColum } from '../database';
import { TransactionEntity } from './transaction.entity';
import { RefundEntity } from './refund.entity';

@Entity('history_balance')
export class HistoryBalanceEntity extends IdDateEntity {
  @ManyToOne(() => UserBalanceEntity, (balance) => balance.id)
  @JoinColumn({ name: 'user_balance' })
  userBalance: UserBalanceEntity;

  @NotNullColum({ name: 'previous_balance', type: 'bigint' })
  previousBalance: bigint;

  @NotNullColum({ name: 'end_balance', type: 'bigint' })
  endBalance: bigint;

  @NotNullColum({ name: 'type_transaction' })
  typeTransaction: string;

  @ManyToOne(() => TransactionEntity, (transaction) => transaction.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction: TransactionEntity;

  @ManyToOne(() => RefundEntity, (refund) => refund.id, { nullable: true })
  @JoinColumn({ name: 'refund_id' })
  refund: RefundEntity;
}
