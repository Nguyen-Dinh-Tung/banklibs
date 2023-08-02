import { Column, Entity } from 'typeorm';
import { IdDateEntity, IsActiveTrueColumn, NotNullColum } from '../database';

@Entity('user_admin')
export class UserAdminEntity extends IdDateEntity {
  @NotNullColum({ length: 50 })
  username: string;

  @NotNullColum({ length: 50 })
  password: string;

  @NotNullColum({})
  email: string;

  @NotNullColum()
  phone: string;

  @IsActiveTrueColumn()
  isActive: boolean;

  @Column({ default: false })
  isRoot: boolean;
}
