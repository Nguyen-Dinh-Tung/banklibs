import { Entity, OneToMany, Unique } from 'typeorm';
import {
  IdDateEntity,
  IsActiveTrueColumn,
  NotNullColum,
  NullColumn,
} from '../database';
import { UserVerificationEntity } from './user-verification.entity';

@Entity('user')
@Unique('user_unique', ['identifierNumber', 'email'])
export class UserEntity extends IdDateEntity {
  @NotNullColum()
  fullname: string;

  @NotNullColum()
  phone: string;

  @NotNullColum()
  email: string;

  @NotNullColum()
  address: string;

  @NotNullColum()
  job: string;

  @NotNullColum({ name: 'identifier_number', unique: true })
  identifierNumber: string;

  @NotNullColum({})
  age: string;

  @NotNullColum()
  avatar: string;

  @NotNullColum({ name: 'back_card' })
  backCard: string;

  @NullColumn({ name: 'front_card' })
  frontCard: string;

  @NotNullColum({ length: '30' })
  username: string;

  @NotNullColum({ length: '50' })
  password: string;

  @IsActiveTrueColumn()
  isActive: string;

  @OneToMany(() => UserVerificationEntity, (verification) => verification.id, {
    nullable: true,
  })
  verifies: UserVerificationEntity[];
}
