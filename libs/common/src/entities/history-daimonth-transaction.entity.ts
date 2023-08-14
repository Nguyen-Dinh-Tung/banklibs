import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DateColumn, IdDateEntity, NotNullColum } from '../database';
import { DaimonthTransactionEntity } from './daimonth-transaction.entity';

@Entity('history_daimonth_transaction')
export class HistoryDaimonthTransaction extends IdDateEntity {
  @ManyToOne(() => DaimonthTransactionEntity, (daimonth) => daimonth.id)
  @JoinColumn()
  daimonth: DaimonthTransactionEntity;

  @DateColumn({ name: 'old_date_excute', nullable: false })
  oldDateExcute: Date;

  @DateColumn({ name: 'new_date_excute', nullable: false })
  newDateExcute: Date;

  @NotNullColum({ type: 'bigint' })
  amount: bigint;
}
