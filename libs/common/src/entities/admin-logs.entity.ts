import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IdDateEntity, NotNullColum } from '../database';
import { UserAdminEntity } from './user-admins.entity';

@Entity('admin_logs')
export class AdminLogsEntity extends IdDateEntity {
  @NotNullColum()
  type: string;

  @NotNullColum()
  data: string;

  @NotNullColum()
  entity: string;

  @NotNullColum()
  idEntity: string;

  @ManyToOne(() => UserAdminEntity, (admin) => admin.id)
  @JoinColumn()
  user: UserAdminEntity;
}
