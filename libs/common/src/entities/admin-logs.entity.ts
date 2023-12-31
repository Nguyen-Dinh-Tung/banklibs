import { Entity, JoinColumn, ManyToOne } from 'typeorm';
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

  @NotNullColum({ name: 'id_entity' })
  idEntity: string;

  @ManyToOne(() => UserAdminEntity, (admin) => admin.id)
  @JoinColumn({ name: 'user_id' })
  user: UserAdminEntity;
}
