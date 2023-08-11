import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import {
  IdDateDeleteEntity,
  IsActiveTrueColumn,
  NotNullColum,
} from '../database';
import { TypeOtpEmailEnum } from '../enum/database.enum';
import { UserEntity } from './user.enitty';
import * as bcrypt from 'bcrypt';
@Entity('otp_email')
export class OtpEmailEntity extends IdDateDeleteEntity {
  @NotNullColum({ type: 'varchar' })
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

  @Column()
  salt: string;

  @BeforeInsert()
  beforeInsert() {
    this.salt = bcrypt.genSaltSync(10);
    this.code = bcrypt.hashSync(this.code, this.salt);
  }
}
