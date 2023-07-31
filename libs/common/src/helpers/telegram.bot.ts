// import { Logger } from '@nestjs/common';
// import { Telegram } from 'telegraf';
// import { Config } from '../config';

// const Bot = new Telegram(Config.get('telegram.bot_token'));

// async function send(message: string, group: string) {
//   try {
//     await Bot.sendMessage(group, message, {
//       parse_mode: 'HTML',
//       disable_web_page_preview: true,
//     });
//   } catch (e: any) {
//     Logger.error(`Send message error: ${e.message}`, 'Telegram');
//     Logger.log('Retry send without parse mode');

//     await Bot.sendMessage(group, message, {
//       disable_web_page_preview: true,
//     }).catch((e) => {
//       Logger.error(
//         `Retry-Send message error: ${e.message}`,
//         e.stack,
//         'Telegram',
//       );
//     });
//   }
// }

// function trackError(message: string) {
//   return send(message, Config.get('telegram.groups.error'));
// }

// function trackQueue(queueName: string) {
//   return send(queueName, Config.get('telegram.groups.error'));
// }

// export const telegram = {
//   trackError,
//   trackQueue,
// };
