import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IdDateEntity, IsActiveTrueColumn, NotNullColum } from '../database';
import { RoleActionsEnum } from '../enum/database.enum';
import { UserAdminEntity } from './user-admin.entity';

@Entity('role')
export class RoleEntity extends IdDateEntity {
  @NotNullColum({
    type: 'enum',
    enum: RoleActionsEnum,
    enumName: 'RoleActionsEnum',
  })
  action: RoleActionsEnum;

  @NotNullColum()
  root: string;

  @ManyToOne(() => UserAdminEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserAdminEntity;

  @IsActiveTrueColumn()
  isActive: boolean;
}
