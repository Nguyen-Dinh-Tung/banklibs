import { EntityManager } from 'typeorm';
import { MessageRabbitMq } from '../modules';
import { UserEntity } from '../entities';
import { StatusRefundEnum, StatusTransactionEnum } from '../enum';

export interface CreateTransacionInterface {
  payload: MessageRabbitMq;
  manager: EntityManager;
  sender?: UserEntity;
  status?: StatusTransactionEnum | StatusRefundEnum;
}
