import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
  IdDateDeleteEntity,
  IsActiveTrueColumn,
  NotNullColum,
} from '../database';
import { TypeOtpEmailEnum } from '../enum/database.enum';
import { UserEntity } from './user.enitty';

@Entity('otp_email')
export class OtpEmailEntity extends IdDateDeleteEntity {
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

  @NotNullColum({ type: 'bigint' })
  expires: bigint;

  @NotNullColum({ default: 1 })
  times: number;

  @NotNullColum({ default: false })
  used: boolean;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;
}
