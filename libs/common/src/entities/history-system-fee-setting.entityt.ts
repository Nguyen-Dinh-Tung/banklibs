import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { SystemFeeEntity } from './system-fee.entity';
import { DateColumn, IdDateEntity, NotNullColum } from '../database';

@Entity('history_system_fee_setting')
export class HistorySystemFeeSettingEntity extends IdDateEntity {
  @ManyToOne(() => SystemFeeEntity, (systemFee) => systemFee.id)
  @JoinColumn({ name: 'system_fee' })
  systemFee: SystemFeeEntity;

  @NotNullColum({ name: 'previous_fee' })
  previousFee: number;

  @NotNullColum({ name: 'new_fee' })
  newFee: number;

  @NotNullColum({ type: 'bigint', name: 'total_fee_collected' })
  totalFeeCollected: bigint;

  @DateColumn({ name: 'old_end_date', nullable: true })
  oldEndDate: Date;

  @DateColumn({ name: 'old_start_date', nullable: true })
  oldStartDate: Date;
}
