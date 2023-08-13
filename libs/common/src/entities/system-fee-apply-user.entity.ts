import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IdDateDeleteEntity, IsActiveFalseColumn } from '../database';
import { UserEntity } from './user.enitty';
import { SystemFeeEntity } from './system-fee.entity';

@Entity('system_fee_apply_user')
export class SystemFeeApplyUserEntity extends IdDateDeleteEntity {
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;

  @IsActiveFalseColumn()
  isActive: boolean;

  @ManyToOne(() => SystemFeeEntity, (systemFee) => systemFee.id)
  @JoinColumn({ name: 'system_fee' })
  systemFee: SystemFeeEntity;
}
