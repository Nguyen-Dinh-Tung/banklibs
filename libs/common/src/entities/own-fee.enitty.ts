import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { DateColumn, IdDateEntity, NotNullColum } from '../database';
import { UserEntity } from './user.enitty';
import { UserAdminEntity } from './user-admins.entity';

@Entity('own_fee')
export class OwnFeeEntity extends IdDateEntity {
  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;

  @NotNullColum({})
  percent: number;

  @NotNullColum({ default: true })
  apply: boolean;

  @DateColumn({ name: 'end_date', nullable: false })
  endDate: Date;

  @DateColumn({ name: 'start_date', nullable: false })
  startDate: Date;

  @OneToOne(() => UserAdminEntity, (user) => user.id)
  @JoinColumn()
  creator: UserAdminEntity;
}
