import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import {
  IdDateEntity,
  IsActiveTrueColumn,
  NotNullColum,
  NullColumn,
} from '../database';
import * as bcrypt from 'bcrypt';
@Entity('user_admin')
export class UserAdminEntity extends IdDateEntity {
  @NotNullColum({ length: 50 })
  username: string;

  @NotNullColum({})
  password: string;

  @NotNullColum({})
  email: string;

  @NotNullColum()
  phone: string;

  @IsActiveTrueColumn()
  isActive: boolean;

  @Column({ default: false })
  isRoot: boolean;

  @NullColumn()
  salt: string;

  @NullColumn({ select: false })
  previousPassword: string;

  @BeforeInsert()
  async beforeInsert() {
    this.salt = await bcrypt.genSalt(10);
    this.password = bcrypt.hashSync(this.password, this.salt);
    this.previousPassword = this.password;
  }

  @BeforeUpdate()
  beforeUpdate() {
    if (this.password !== this.previousPassword) {
      this.password = bcrypt.hashSync(this.password, this.salt);
      this.previousPassword = this.password;
    }
  }
}
