import { Check, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { IdDateEntity, NotNullColum } from '../database';
import { UserEntity } from './user.enitty';
import { HistoryBalanceEntity } from './history-balance.entity';

@Entity('balance')
@Check(`"surplus" > 0`)
export class BalanceEntity extends IdDateEntity {
  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @NotNullColum({ default: 0, type: 'bigint', unsigned: true })
  surplus: bigint;

  @NotNullColum({ default: false })
  freeze: boolean;

  @NotNullColum({ name: 'bank_number', unique: true, length: 12 })
  bankNumber: string;

  @OneToMany(() => HistoryBalanceEntity, (history) => history.id)
  historyBalance: HistoryBalanceEntity[];
}
