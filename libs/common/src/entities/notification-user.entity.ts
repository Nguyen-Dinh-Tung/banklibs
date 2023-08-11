import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IdDateEntity, IsActiveFalseColumn } from '../database';
import { UserEntity } from './user.enitty';
import { NotificationEntity } from './notification.enity';

@Entity('notification_user')
export class NotificationUserEntity extends IdDateEntity {
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => NotificationEntity, (notification) => notification.id)
  @JoinColumn()
  notification: NotificationEntity;

  @IsActiveFalseColumn()
  isActive: boolean;
}
