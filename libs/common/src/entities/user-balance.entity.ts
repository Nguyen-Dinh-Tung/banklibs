import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { IdDateEntity, NotNullColum } from '../database';
import { UserEntity } from './user.enitty';
import { HistoryBalanceEntity } from './history-balance.entity';

@Entity('user_balance')
export class UserBalanceEntity extends IdDateEntity {
  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn()
  user: UserEntity;

  @NotNullColum({ default: 0, type: 'bigint' })
  surplus: bigint;

  @NotNullColum({ default: false })
  freeze: boolean;

  @OneToMany(() => HistoryBalanceEntity, (history) => history.id)
  historyBalance: HistoryBalanceEntity;
}
