import { Entity } from 'typeorm';
import {
  DateColumn,
  IdDateEntity,
  IsActiveFalseColumn,
  NotNullColum,
} from '../database';

@Entity('event')
export class EventEntity extends IdDateEntity {
  @NotNullColum({ type: 'varchar' })
  description: string;

  @NotNullColum({ type: 'varchar' })
  url: string;

  @NotNullColum({ type: 'varchar' })
  background: string;

  @IsActiveFalseColumn()
  isActive: boolean;

  @NotNullColum({ type: 'varchar' })
  name: string;

  @DateColumn({ name: 'start_date' })
  startDate: Date;

  @DateColumn({ name: 'end_date' })
  endDate: Date;
}
