import { Entity } from 'typeorm';
import { IdDateDeleteEntity, NotNullColum } from '../database';

@Entity('job')
export class JobEntity extends IdDateDeleteEntity {
  @NotNullColum({ unique: true })
  name: string;

  @NotNullColum()
  description: string;
}
