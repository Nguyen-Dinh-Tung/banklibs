import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IdDateEntity } from '../database';
import { UserEntity } from './user.enitty';

Entity('user_home');
export class UserFamilyEntity extends IdDateEntity {
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  creator: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  homie: UserEntity;
}
