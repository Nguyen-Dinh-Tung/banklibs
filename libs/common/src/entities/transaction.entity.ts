import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DateColumn, IdDateEntity, NotNullColum } from '../database';
import {
  StatusTransactionEnum,
  TypeTransactionEnum,
} from '../enum/database.enum';
import { UserEntity } from './user.enitty';
import { SystemFeeEntity } from './system-fee.entity';
import { OwnFeeEntity } from './own-fee.enitty';

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

  @NotNullColum({ name: 'percent_fee' })
  percentFee: number;

  @NotNullColum({ name: 'amount_system_fee', type: 'bigint' })
  amountSystemFee: bigint;

  @NotNullColum({ name: 'amount_own_fee', type: 'bigint' })
  amountOwnFee: bigint;

  @NotNullColum({})
  code: string;

  @DateColumn({ nullable: true, name: 'end_time' })
  endTime: Date;

  @Column({ name: 'system_handle', default: false })
  systemHandle: boolean;

  @NotNullColum({ name: 'number_bank' })
  bankNumber: string;

  @ManyToOne(() => UserEntity, (user) => user.id, { nullable: true })
  @JoinColumn({ name: 'creator_id' })
  creator: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'receiver_id' })
  receiver: UserEntity;

  @ManyToOne(() => SystemFeeEntity, (systemFee) => systemFee.id, {
    nullable: true,
  })
  @JoinColumn({ name: 'system_fee_id' })
  systemFee: SystemFeeEntity;

  @ManyToOne(() => OwnFeeEntity, (ownFee) => ownFee.id)
  @JoinColumn({ name: 'own_fee_id' })
  ownFee: OwnFeeEntity;

  @NotNullColum({})
  content: string;
}
