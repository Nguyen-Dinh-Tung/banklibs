import { Entity } from 'typeorm';
import {
  DateColumn,
  IdDateEntity,
  IsActiveTrueColumn,
  NotNullColum,
  NullColumn,
} from '../database';
import { MediaNotificationEnum } from '../enum/database.enum';

@Entity('notification')
export class NotificationEntity extends IdDateEntity {
  @IsActiveTrueColumn()
  isActive: boolean;

  @NotNullColum()
  content: string;

  @NotNullColum({})
  global: boolean;

  @NotNullColum({
    type: 'enum',
    enum: MediaNotificationEnum,
    enumName: 'MediaNotificationEnum',
  })
  media: MediaNotificationEnum;

  @NotNullColum()
  title: string;

  @DateColumn({ name: 'send_date' })
  sendDate: Date;

  @NotNullColum({ default: false, name: 'is_send' })
  isSend: boolean;

  @NullColumn({ name: 'url_image' })
  urlImage: string;
}
