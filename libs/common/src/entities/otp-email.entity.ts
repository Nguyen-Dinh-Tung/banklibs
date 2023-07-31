import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
  IdDateDeleteEntity,
  IsActiveTrueColumn,
  NotNullColum,
} from '../database';
import { TypeOtpEmailEnum } from '../enum/database.enum';
import { UserEntity } from './user.enitty';

@Entity('otp_email')
export class OtpEmail extends IdDateDeleteEntity {
  @NotNullColum({ length: 6 })
  code: string;

  @IsActiveTrueColumn()
  isActive: boolean;

  @NotNullColum({
    type: 'enum',
    enum: TypeOtpEmailEnum,
    enumName: 'TypeOtpEmailEnum',
  })
  type: TypeOtpEmailEnum;

  @Column()
  expires: number;

  @Column()
  times: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;
}
