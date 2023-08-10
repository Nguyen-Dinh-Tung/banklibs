import { Entity, JoinColumn, OneToMany } from 'typeorm';
import {
  DateColumn,
  IdDateDeleteEntity,
  IdDateEntity,
  NotNullColum,
} from '../database';

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
