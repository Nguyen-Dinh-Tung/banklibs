import { Logger } from '@nestjs/common';

const l = new Logger();
export const logger = {
  error: (component: string, message: string, stack?: string) => {
    l.error(message, stack, component);
  },
  info: (component: string, message: string) => l.log(message, component),
  warn: (component: string, message: string) => l.warn(message, component),
  debug: (component: string, message: string) => l.debug(message, component),
};
