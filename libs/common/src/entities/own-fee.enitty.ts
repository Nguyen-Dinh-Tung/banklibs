import { Entity, JoinColumn, OneToOne } from 'typeorm';
import { IdDateEntity, NotNullColum } from '../database';
import { UserEntity } from './user.enitty';

@Entity('own_fee')
export class OwnFeeEntity extends IdDateEntity {
  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;

  @NotNullColum({})
  percent: number;

  @NotNullColum({ default: true })
  apply: boolean;
}
