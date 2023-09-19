import { format } from 'date-fns';
import _ from 'lodash';
import { redis } from '../common/redis';

export class PausedRabbitMqQueues {
  public static key = `paused-rabbit-mq-queues:${process.env.IMAGE_TAG}`;

  public static async add(queueName: string): Promise<void> {
    const date = format(_.now(), 'yyyy-MM-dd HH:mm:ss');
    await redis.hset(PausedRabbitMqQueues.key, queueName, date);
  }

  public static async delete(queueName: string): Promise<void> {
    await redis.hdel(PausedRabbitMqQueues.key, queueName);
  }

  public static async getPausedQueues() {
    const result = await redis.hgetall(PausedRabbitMqQueues.key);

    return Object.keys(result);
  }
}
