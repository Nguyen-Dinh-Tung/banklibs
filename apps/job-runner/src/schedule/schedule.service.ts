import { EXCHANEL_NAME, ROUTER_KEY } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import * as amqp from 'amqplib';

@Injectable()
export class ScheduleService {
  // private readonly logger = new Logger();
  // private channel: amqp.Channel;
  // constructor() {
  //   this.connect();
  // }
  // async connect() {
  //   const connect = await amqp.connect(process.env.AMQP_CLOUND);
  //   this.channel = await connect.createChannel();
  //   await this.channel.assertExchange(
  //     EXCHANEL_NAME.ACCOUNT_EXCHANEL_NAME,
  //     'direct',
  //     {
  //       durable: true,
  //     },
  //   );
  // }
  // async sendToQueue() {
  //   try {
  //     this.logger.log(`Start Process`);
  //     await this.channel.publish(
  //       EXCHANEL_NAME.ACCOUNT_EXCHANEL_NAME,
  //       ROUTER_KEY.ACCOUNT_ROUTER_KEY,
  //       Buffer.from('message'),
  //     );
  //     this.logger.log(`SendQueue success`);
  //   } catch (e) {
  //     this.logger.error(`Error sending to queue: ${e.message}`);
  //   }
  // }
  // @Interval(5000)
  // async interval() {
  //   await this.sendToQueue();
  // }
}
