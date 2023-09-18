import { Controller } from '@nestjs/common';
import { AccountConsumer } from './account/account.consumer';

@Controller()
export class JobRunnerHandle {
  constructor(private readonly accountConsumer: AccountConsumer) {}
  public connectConsumer() {
    return [this.accountConsumer];
  }
}
