import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
  DateColumn,
  IdDateEntity,
  NotNullColum,
  NullColumn,
} from '../database';
import { UserEntity } from './user.enitty';

@Entity('daimonth_transaction')
export class DaimonthTransactionEntity extends IdDateEntity {
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;

  @NullColumn()
  name: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  receiver: UserEntity;

  @NotNullColum({ type: 'bigint' })
  amount: bigint;

  @NotNullColum()
  apply: boolean;

  @DateColumn({ name: 'date_excute', nullable: false })
  dateExcute: Date;

  @NotNullColum()
  content: string;
}
