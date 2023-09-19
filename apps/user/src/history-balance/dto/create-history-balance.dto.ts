import { TransactionEntity, UserBalanceEntity } from '@app/common';
import { RefundEntity } from '@app/common/entities/refund.entity';

export class CreateHistoryBalance {
  userBalance: UserBalanceEntity;

  previousBalance: bigint;

  endBalance: bigint;

  typeTransaction: string;

  transaction?: TransactionEntity;

  refund?: RefundEntity;
}
