import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IdDateDeleteEntity } from '../database';
import { UserEntity } from './user.enitty';
import { SystemFeeEntity } from './system-fee.entity';

@Entity('system_fee_apply_user')
export class SystemFeeApplyUserEntity extends IdDateDeleteEntity {
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => SystemFeeEntity, (systemFee) => systemFee.id)
  @JoinColumn()
  systemFee: SystemFeeEntity;
}
