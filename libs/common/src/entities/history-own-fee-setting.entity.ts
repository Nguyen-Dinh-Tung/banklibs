import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OwnFeeEntity } from './own-fee.enitty';
import { DateColumn, IdDateEntity, NotNullColum } from '../database';

@Entity('history_own_fee_setting')
export class HistoryOwnFeeSettingEntity extends IdDateEntity {
  @ManyToOne(() => OwnFeeEntity, (own) => own.id)
  @JoinColumn({ name: 'own_fee_id' })
  ownFee: OwnFeeEntity;

  @NotNullColum({ name: 'previous_fee' })
  previousFee: number;

  @NotNullColum({ name: 'new_fee' })
  newFee: number;

  @NotNullColum({ type: 'bigint', name: 'total_fee_collected' })
  totalFeeCollected: bigint;

  @DateColumn({ name: 'old_end_date', nullable: false })
  oldEndDate: Date;

  @DateColumn({ name: 'old_start_date', nullable: false })
  oldStartDate: Date;
}
