import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IdDateEntity, NotNullColum, NullColumn } from '../database';
import { KycStatusUserEnum, TypeVerificationEnum } from '../enum/database.enum';
import { UserEntity } from './user.enitty';

@Entity('user_verification')
export class UserVerificationEntity extends IdDateEntity {
  @NotNullColum({
    enum: TypeVerificationEnum,
    enumName: 'TypeVerificationEnum',
    type: 'enum',
  })
  type: TypeVerificationEnum;

  @NotNullColum({
    type: 'enum',
    enum: KycStatusUserEnum,
    enumName: 'KycStatusUserEnum',
  })
  kycStatus: KycStatusUserEnum;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;

  @NullColumn({ length: 255 })
  reason: string;
}
