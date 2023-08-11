import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { IdDateEntity, NotNullColum } from '../database';
import { StatusRefundEnum } from '../enum';
import { TransactionEntity } from './transaction.entity';

@Entity('refund')
export class RefundEntity extends IdDateEntity {
  @NotNullColum({ type: 'varchar' })
  reason: string;

  @NotNullColum({
    type: 'enum',
    enum: StatusRefundEnum,
    enumName: 'StatusRefundEnum',
  })
  status: StatusRefundEnum;

  @NotNullColum()
  code: string;

  @OneToOne(() => TransactionEntity, (transaction) => transaction.id)
  @JoinColumn({ name: 'transaction_id' })
  transaction: TransactionEntity;
}
