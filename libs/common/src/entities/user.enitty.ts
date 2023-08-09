import { BeforeInsert, BeforeUpdate, Entity, OneToMany, Unique } from 'typeorm';
import {
  IdDateEntity,
  IsActiveTrueColumn,
  NotNullColum,
  NullColumn,
} from '../database';
import { UserVerificationEntity } from './user-verification.entity';
import * as bcrypt from 'bcrypt';

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
  age: number;

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

  @NotNullColum({})
  country: string;

  @NotNullColum({})
  city: string;

  @OneToMany(() => UserVerificationEntity, (verification) => verification.id, {
    nullable: true,
  })
  verifies: UserVerificationEntity[];

  @NullColumn()
  salt: string;

  @NullColumn({ select: false })
  previousPassword: string;

  @BeforeInsert()
  beforeInsert() {
    this.salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, this.salt);
  }

  @BeforeUpdate()
  beforeUpdate() {
    if (this.password !== this.previousPassword) {
      this.password = bcrypt.hashSync(this.password, this.salt);
    }
  }
}
