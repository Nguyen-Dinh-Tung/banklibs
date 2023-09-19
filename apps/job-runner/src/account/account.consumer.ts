// import { Injectable, Logger } from '@nestjs/common';
// import { QueueNameEnum } from '../common/constants/queue-name';
// import { EXPIRES_QUEUE } from '../common/constants/queue-expires';
// import { EXCHANEL_NAME, ROUTER_KEY } from '@app/common';
// import * as amqp from 'amqplib';

// @Injectable()
// export class AccountConsumer {
//   static logger = new Logger();

//   static queueName: string = QueueNameEnum.QUEUE_ACCOUNT;

//   static exchangeName: string = EXCHANEL_NAME.ACCOUNT_EXCHANEL_NAME;

//   static durable = true;

//   static expiration = EXPIRES_QUEUE;

//   static exclusive = true;

//   constructor() {
//     this.assetExchangeAndBindingQueue();
//   }

//   async assetExchangeAndBindingQueue(): Promise<void> {
//     AccountConsumer.logger.log('Start process');
//     try {
//       const connect = await amqp.connect(process.env.AMQP_CLOUND);
//       const channel = await connect.createChannel();

//       await channel.assertExchange(
//         EXCHANEL_NAME.ACCOUNT_EXCHANEL_NAME,
//         'direct',
//         {
//           durable: true,
//         },
//       );

//       await channel.assertQueue(AccountConsumer.queueName, {
//         exclusive: true,
//       });

//       await channel.bindQueue(
//         AccountConsumer.queueName,
//         EXCHANEL_NAME.ACCOUNT_EXCHANEL_NAME,
//         ROUTER_KEY.ACCOUNT_ROUTER_KEY,
//       );

//       await channel.consume(AccountConsumer.queueName, async (msg) => {
//         console.log(msg.content.toString());

//         await channel.ack(msg);
//       });
//       AccountConsumer.logger.log('Run Consumer');
//     } catch (e) {
//       AccountConsumer.logger.error('Process error ' + e.message);
//       process.exit(1);
//     }
//   }
// }
