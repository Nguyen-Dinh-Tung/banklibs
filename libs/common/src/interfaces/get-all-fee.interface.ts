import { OwnFeeEntity, SystemFeeEntity } from '@app/common';

export interface getAllFee {
  amountOwnFee: bigint;
  amountSystemFee: bigint;
  ownFee: OwnFeeEntity;
  systemFee: SystemFeeEntity;
}
