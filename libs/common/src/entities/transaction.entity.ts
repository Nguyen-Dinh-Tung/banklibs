import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IdDateEntity, NotNullColum } from '../database';
import {
  StatusTransactionEnum,
  TypeTransactionEnum,
} from '../enum/database.enum';
import { UserEntity } from './user.enitty';

@Entity('transaction')
export class TransactionEntity extends IdDateEntity {
  @NotNullColum({
    type: 'enum',
    enum: TypeTransactionEnum,
    enumName: 'TypeTransactionEnum',
    name: 'type_transaction',
  })
  typeTransaction: TypeTransactionEnum;

  @NotNullColum({
    type: 'enum',
    enum: StatusTransactionEnum,
    enumName: 'StatusTransactionEnum',
  })
  status: StatusTransactionEnum;

  @NotNullColum({ type: 'bigint', name: 'amount_real' })
  amountReal: bigint;

  @NotNullColum({ type: 'bigint', name: 'amount_pay' })
  amountPay: bigint;

  @NotNullColum({ type: 'bigint', name: 'percent_fee' })
  percentFee: bigint;

  @NotNullColum({ name: 'amount_fee' })
  amountFee: number;

  @NotNullColum({})
  code: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn()
  creator: UserEntity;

  @Column({ name: 'system_handle', default: false })
  systemHandle: boolean;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  receiver: UserEntity;
}
