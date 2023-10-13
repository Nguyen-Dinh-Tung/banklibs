import { BalanceEntity } from '../entities';
import { getAllFee } from './get-all-fee.interface';

export interface TransactionInformationInterface {
  allFee: getAllFee;
  checkReceiver: BalanceEntity;
  senderBalance: BalanceEntity;
  payAmountReal: bigint;
  percentFee: number;
}
