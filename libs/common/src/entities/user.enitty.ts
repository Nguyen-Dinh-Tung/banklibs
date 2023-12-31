import {
  BeforeInsert,
  BeforeUpdate,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Unique,
} from 'typeorm';
import {
  IdDateEntity,
  IsActiveTrueColumn,
  NotNullColum,
  NullColumn,
} from '../database';
import { UserVerificationEntity } from './user-verification.entity';
import * as bcrypt from 'bcrypt';
import { JobEntity } from './job.entity';
import { UserBalanceEntity } from './user-balance.entity';

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

  @ManyToOne(() => JobEntity, (job) => job.id)
  @JoinColumn()
  job: JobEntity;

  @NotNullColum({ name: 'identifier_number', unique: true })
  identifierNumber: string;

  @NotNullColum({})
  age: number;

  @NotNullColum()
  avatar: string;

  @NotNullColum({ name: 'back_card' })
  backCard: string;

  @NullColumn({ name: 'front_card' })
  frontCard: string;

  @NotNullColum({ length: '30' })
  username: string;

  @NotNullColum({})
  password: string;

  @IsActiveTrueColumn()
  isActive: string;

  @NotNullColum({})
  country: string;

  @NotNullColum({})
  city: string;

  @OneToMany(() => UserVerificationEntity, (verification) => verification.id, {
    nullable: true,
  })
  verifies: UserVerificationEntity[];

  @OneToOne(() => UserBalanceEntity, (balance) => balance.id)
  @JoinColumn()
  balance: UserBalanceEntity;
}
