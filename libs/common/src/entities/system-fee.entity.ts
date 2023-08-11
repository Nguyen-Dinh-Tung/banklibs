import { Entity } from 'typeorm';
import { DateColumn, IdDateDeleteEntity, NotNullColum } from '../database';

@Entity('system_fee')
export class SystemFeeEntity extends IdDateDeleteEntity {
  @NotNullColum()
  apply: boolean;

  @NotNullColum()
  percent: number;

  @DateColumn({ name: 'end_date' })
  endDate: Date;

  @DateColumn({ name: 'start_date' })
  startDate: Date;
}
