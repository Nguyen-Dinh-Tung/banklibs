import { UserBalanceEntity } from '../entities';
import { getAllFee } from './get-all-fee.interface';

export interface TransactionInformationInterface {
  allFee: getAllFee;
  checkReceiver: UserBalanceEntity;
  senderBalance: UserBalanceEntity;
  payAmountReal: bigint;
  percentFee: number;
}
