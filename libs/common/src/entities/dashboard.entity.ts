import { Entity } from 'typeorm';
import { IdDateEntity, NotNullColum } from '../database';

@Entity('dashboard_admin')
export class DashboardAdmin extends IdDateEntity {
  @NotNullColum({ type: 'bigint', name: 'total_transaction' })
  totalTransaction: bigint;

  @NotNullColum({ type: 'bigint', name: 'total_amount_pay' })
  totalAmountPay: bigint;

  @NotNullColum({ type: 'bigint', name: 'total_real_pay' })
  totalRealPay: bigint;

  @NotNullColum({ type: 'bigint', name: 'total_real_user' })
  totalNewUser: bigint;

  @NotNullColum({ type: 'bigint', name: 'total_fee' })
  totalFee: bigint;

  @NotNullColum({ type: 'bigint', name: 'total_system_fee' })
  totalSystemFee: bigint;

  @NotNullColum({ type: 'bigint', name: 'total_own_fee' })
  totalOwnFee: bigint;

  @NotNullColum({ type: 'bigint', name: 'total_refund' })
  totalRefund: bigint;

  @NotNullColum({ type: 'bigint', name: 'amount_refund' })
  amountRefund: bigint;
}
